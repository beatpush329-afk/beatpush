import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL, STORAGE_KEYS } from '../constants';

/**
 * API error response structure
 */
export interface APIError {
  message: string;
  statusCode?: number;
  code?: string;
  errors?: Record<string, string[]>;
  details?: Record<string, any>;
}

/**
 * HTTP status codes for error handling
 */
enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  RATE_LIMITED = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'Invalid request. Please check your input.',
  [HttpStatus.UNAUTHORIZED]: 'Your session has expired. Please login again.',
  [HttpStatus.FORBIDDEN]: 'You do not have permission to perform this action.',
  [HttpStatus.NOT_FOUND]: 'The requested resource was not found.',
  [HttpStatus.CONFLICT]: 'The resource already exists.',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Please check your input and try again.',
  [HttpStatus.RATE_LIMITED]: 'Too many requests. Please wait before trying again.',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Server error. Please try again later.',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable. Please try again later.',
  [HttpStatus.GATEWAY_TIMEOUT]: 'Request timeout. Please check your connection and try again.',
};

/**
 * Axios instance for API requests
 */
export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor: Add authentication token and request logging
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API] Request error:', error.message);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Handle errors with retry logic and proper error messages
 */
let retryCount = 0;
const MAX_RETRIES = 2;

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[API] Response ${response.status} from ${response.config.baseURL}${response.config.url}`
      );
    }
    retryCount = 0; // Reset retry count on success
    return response;
  },
  async (error: AxiosError<APIError>) => {
    const config = error.config as InternalAxiosRequestConfig | undefined;
    const status = error.response?.status;

    // Handle 401 Unauthorized - redirect to login
    if (status === HttpStatus.UNAUTHORIZED) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);

        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
        }
      }
    }

    // Handle 403 Forbidden - user lacks permissions
    if (status === HttpStatus.FORBIDDEN) {
      console.error('[API] Forbidden access:', error.response?.data);
    }

    // Handle network errors with retry logic
    if (!error.response && retryCount < MAX_RETRIES) {
      retryCount++;
      console.warn(`[API] Network error - Retry attempt ${retryCount}/${MAX_RETRIES}`);

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, retryCount - 1) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (config) {
        return apiClient.request(config);
      }
    }

    // Handle rate limiting with backoff
    if (status === HttpStatus.RATE_LIMITED) {
      const retryAfter = error.response?.headers['retry-after'];
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : 60000; // 1 minute default
      console.warn(`[API] Rate limited - waiting ${delay}ms before retry`);

      await new Promise((resolve) => setTimeout(resolve, delay));

      if (config) {
        return apiClient.request(config);
      }
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error:', {
        status,
        message: error.response?.data?.message || error.message,
        url: `${error.config?.baseURL}${error.config?.url}`,
      });
    }

    return Promise.reject(error);
  }
);

/**
 * Extract user-friendly error message from API response or HTTP status
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // API returned error message
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    // Use user-friendly message for HTTP status
    const status = error.response?.status;
    if (status && ERROR_MESSAGES[status]) {
      return ERROR_MESSAGES[status];
    }

    // Network error
    if (!error.response && error.message === 'Network Error') {
      return 'Network connection failed. Please check your internet connection.';
    }

    return error.message || 'An error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
}

/**
 * Extract validation errors from API response
 */
export function getValidationErrors(
  error: unknown
): Record<string, string> | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as APIError | undefined;

    if (data?.errors) {
      // Convert array of errors to single error message per field
      return Object.entries(data.errors).reduce(
        (acc, [field, messages]) => {
          acc[field] = messages[0] || 'Invalid value';
          return acc;
        },
        {} as Record<string, string>
      );
    }
  }

  return null;
}

/**
 * Check if error is due to network connectivity
 */
export function isNetworkError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return !error.response && error.message === 'Network Error';
  }
  return false;
}

/**
 * Check if error is due to authentication
 */
export function isAuthenticationError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return error.response?.status === HttpStatus.UNAUTHORIZED;
  }
  return false;
}

/**
 * Check if error is due to authorization
 */
export function isAuthorizationError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return error.response?.status === HttpStatus.FORBIDDEN;
  }
  return false;
}

/**
 * Check if error is due to validation
 */
export function isValidationError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return error.response?.status === HttpStatus.UNPROCESSABLE_ENTITY;
  }
  return false;
}

/**
 * Check if error is due to not found
 */
export function isNotFoundError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return error.response?.status === HttpStatus.NOT_FOUND;
  }
  return false;
}

/**
 * Check if error is due to server error
 */
export function isServerError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    return !!status && status >= HttpStatus.INTERNAL_SERVER_ERROR;
  }
  return false;
}

export default apiClient;
