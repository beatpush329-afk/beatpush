/**
 * Paystack Payment Integration
 * 
 * Handles payment initialization, verification, and callbacks
 */

import PaystackPop from '@paystack/inline-js';

export interface PaymentConfig {
  email: string;
  amount: number; // Amount in kobo (multiply by 100)
  reference?: string;
  currency?: string;
  metadata?: Record<string, any>;
  onSuccess?: (response: PaystackSuccessResponse) => void;
  onClose?: () => void;
}

export interface PaystackSuccessResponse {
  reference: string;
  status: string;
  message: string;
  trans: string;
  transaction: string;
  trxref: string;
}

/**
 * Initialize Paystack payment
 */
export function initializePayment(config: PaymentConfig) {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    console.error('Paystack public key not found');
    throw new Error('Payment system not configured. Please contact support.');
  }

  // Validate amount
  if (!config.amount || config.amount <= 0) {
    throw new Error('Invalid payment amount');
  }

  // Validate email
  if (!config.email || !isValidEmail(config.email)) {
    throw new Error('Invalid email address');
  }

  // Generate reference if not provided
  const reference = config.reference || generateReference();

  // Initialize Paystack
  const paystack = new PaystackPop();

  paystack.newTransaction({
    key: publicKey,
    email: config.email,
    amount: Math.round(config.amount * 100), // Convert to kobo
    currency: config.currency || 'NGN',
    ref: reference,
    metadata: {
      ...config.metadata,
      custom_fields: [
        {
          display_name: 'Reference',
          variable_name: 'reference',
          value: reference,
        },
      ],
    },
    onSuccess: (response) => {
      console.log('Payment successful:', response);
      config.onSuccess?.(response);
    },
    onCancel: () => {
      console.log('Payment cancelled by user');
      config.onClose?.();
    },
  });
}

/**
 * Generate unique payment reference
 */
export function generateReference(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `BP-${timestamp}-${random}`;
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format amount for display
 */
export function formatAmount(amount: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convert USD to NGN (approximate - should use live rates in production)
 */
export function convertUSDtoNGN(usdAmount: number): number {
  const exchangeRate = 1500; // Approximate rate - use live API in production
  return Math.round(usdAmount * exchangeRate);
}

/**
 * Verify payment on backend
 */
export async function verifyPayment(reference: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/payments/verify/${reference}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
}

/**
 * Get supported currencies
 */
export const SUPPORTED_CURRENCIES = ['NGN', 'USD', 'GHS', 'ZAR'] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

/**
 * Currency symbols
 */
export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  NGN: '₦',
  USD: '$',
  GHS: '₵',
  ZAR: 'R',
};

/**
 * Test card details for development
 */
export const TEST_CARDS = {
  SUCCESS: {
    number: '4084084084084081',
    cvv: '408',
    expiry: '12/25',
    pin: '0000',
  },
  INSUFFICIENT_FUNDS: {
    number: '5078 5078 5078 5078 12',
    cvv: '081',
    expiry: '09/32',
    pin: '0000',
  },
};

/**
 * Payment status types
 */
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'abandoned';

/**
 * Transaction interface
 */
export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  beatId?: string;
  beatTitle?: string;
  createdAt: string;
  paidAt?: string;
}
