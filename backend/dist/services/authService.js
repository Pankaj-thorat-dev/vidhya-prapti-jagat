"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * Register new user
 */
const registerUser = async (name, email, password) => {
    // Check if user already exists
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        throw new errorHandler_1.AppError('Email already registered', 400);
    }
    // Create new user
    const user = await User_1.default.create({ name, email, password });
    // Generate token
    const token = (0, jwt_1.generateToken)({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};
exports.registerUser = registerUser;
/**
 * Login user
 */
const loginUser = async (email, password) => {
    // Find user with password field
    const user = await User_1.default.findOne({ email }).select('+password');
    if (!user) {
        throw new errorHandler_1.AppError('Invalid credentials', 401);
    }
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new errorHandler_1.AppError('Invalid credentials', 401);
    }
    // Generate token
    const token = (0, jwt_1.generateToken)({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};
exports.loginUser = loginUser;
