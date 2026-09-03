/**
 * Application-wide constants
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export const USER_ROLES = {
  ARTIST: 'artist',
  DJ: 'dj',
  PRODUCER: 'producer',
  FAN: 'fan',
  ADMIN: 'admin',
} as const;

export const AUDIO_FORMATS = ['mp3', 'wav', 'flac'] as const;
export const IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp'] as const;
export const VIDEO_FORMATS = ['mp4', 'mov', 'avi'] as const;

export const MAX_FILE_SIZES = {
  AUDIO: 50 * 1024 * 1024, // 50MB
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 100 * 1024 * 1024, // 100MB
} as const;

export const MUSICAL_KEYS = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

export const GENRES = [
  'Afrobeats',
  'Hip Hop',
  'R&B',
  'Amapiano',
  'Highlife',
  'Gospel',
  'Reggae',
  'Dancehall',
  'Pop',
  'Electronic',
  'Jazz',
  'Soul',
  'Other',
] as const;

export const TEMPO_RANGES = {
  MIN: 60,
  MAX: 200,
} as const;

export const PRICE_RANGES = {
  MIN: 0,
  MAX: 500,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const QUERY_KEYS = {
  USER: 'user',
  PROFILE: 'profile',
  BEATS: 'beats',
  BEAT: 'beat',
  TRACKS: 'tracks',
  TRACK: 'track',
  POSTS: 'posts',
  POST: 'post',
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
  CAMPAIGNS: 'campaigns',
  CAMPAIGN: 'campaign',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications',
  BOOKINGS: 'bookings',
  FAN_CLUBS: 'fanClubs',
  PROMO_LINKS: 'promoLinks',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  BEATS: '/beats',
  MESSAGES: '/messages',
  ANALYTICS: '/analytics',
  CAMPAIGNS: '/campaigns',
  SETTINGS: '/settings',
  DISCOVER: '/discover',
  ADMIN: '/admin',
} as const;
