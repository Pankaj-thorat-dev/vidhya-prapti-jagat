"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.getAllOrders = exports.getMyOrders = exports.verifyOrderPayment = exports.createNewOrder = exports.getAdminStats = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const paymentService_1 = require("../services/paymentService");
const User_1 = __importDefault(require("../models/User"));
const Note_1 = __importDefault(require("../models/Note"));
/**
 * Get admin statistics
 * GET /api/orders/admin/stats
 */
const getAdminStats = async (req, res, next) => {
    try {
        const [totalUsers, totalNotes, totalOrders, completedOrders] = await Promise.all([
            User_1.default.countDocuments(),
            Note_1.default.countDocuments({ isActive: true }),
            Order_1.default.countDocuments(),
            Order_1.default.find({ status: 'completed' }),
        ]);
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const pendingOrders = await Order_1.default.countDocuments({ status: 'pending' });
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalNotes,
                totalOrders,
                completedOrders: completedOrders.length,
                pendingOrders,
                totalRevenue,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminStats = getAdminStats;
/**
 * Create new order for multiple notes
 * POST /api/orders/create
 */
const createNewOrder = async (req, res, next) => {
    try {
        const { noteIds } = req.body;
        if (!noteIds || !Array.isArray(noteIds) || noteIds.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Note IDs array is required',
            });
            return;
        }
        const orderData = await (0, paymentService_1.createOrder)(req.user.id, noteIds);
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: orderData,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createNewOrder = createNewOrder;
/**
 * Verify payment
 * POST /api/orders/verify
 */
const verifyOrderPayment = async (req, res, next) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            res.status(400).json({
                success: false,
                message: 'All payment details are required',
            });
            return;
        }
        const result = await (0, paymentService_1.verifyPayment)(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            data: result.order,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOrderPayment = verifyOrderPayment;
/**
 * Get user orders with populated note details
 * GET /api/orders/my-orders
 */
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order_1.default.find({ userId: req.user.id })
            .populate('notes.noteId', 'title price fileUrl fileName')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyOrders = getMyOrders;
/**
 * Get all orders (Admin only)
 * GET /api/orders
 */
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order_1.default.find()
            .populate('userId', 'name email')
            .populate('notes.noteId', 'title price')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllOrders = getAllOrders;
/**
 * Get order by ID
 * GET /api/orders/:id
 */
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order_1.default.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('notes.noteId', 'title price fileUrl fileName');
        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found',
            });
            return;
        }
        // Check if user owns this order or is admin
        if (order.userId._id.toString() !== req.user.id &&
            req.user.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOrderById = getOrderById;
