"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
/**
 * Custom error class
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = 'statusCode' in err ? err.statusCode : 500;
    let message = err.message || 'Internal server error';
    // Handle MongoDB connection errors
    if (err.message.includes('buffering timed out')) {
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
            hint: err.message.includes('buffering timed out')
                ? 'See MONGODB_SETUP.md for quick MongoDB setup instructions'
                : undefined
        }),
    });
};
exports.errorHandler = errorHandler;
