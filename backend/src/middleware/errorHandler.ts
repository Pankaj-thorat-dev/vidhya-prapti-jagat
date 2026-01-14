import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: AppError | Error | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  let message = err.message || 'Internal server error';

  // Handle Razorpay errors
  if (err.error && err.error.description) {
    message = `Payment gateway error: ${err.error.description}`;
  } else if (err.message && err.message.includes('The api key provided is invalid')) {
    message = 'Payment gateway not configured. Please contact administrator.';
  } else if (err.message && err.message.includes('The api secret provided is invalid')) {
    message = 'Payment gateway not configured. Please contact administrator.';
  }

  // Handle MongoDB connection errors
  if (message && message.includes('buffering timed out')) {
    message = 'Database not connected. Please set up MongoDB to use this feature.';
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      hint: message.includes('buffering timed out') 
        ? 'See MONGODB_SETUP.md for quick MongoDB setup instructions'
        : message.includes('Payment gateway not configured')
        ? 'Configure valid Razorpay keys in backend/.env file'
        : undefined
    }),
  });
};
