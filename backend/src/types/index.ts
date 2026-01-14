import { Request } from 'express';

/**
 * Extended Express Request with authenticated user
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

/**
 * User role types
 */
export type UserRole = 'user' | 'admin';

/**
 * Payment status types
 */
export type PaymentStatus = 'pending' | 'completed' | 'failed';
