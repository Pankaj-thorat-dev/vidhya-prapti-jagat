"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayInstance = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
/**
 * Initialize Razorpay instance with credentials
 * Uses temporary test values if environment variables are not set
 */
exports.razorpayInstance = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_temp_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'temp_key_secret_for_development',
});
