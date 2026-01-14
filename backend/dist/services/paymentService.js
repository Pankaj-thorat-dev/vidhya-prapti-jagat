"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createOrder = void 0;
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = require("../config/razorpay");
const Order_1 = __importDefault(require("../models/Order"));
const Note_1 = __importDefault(require("../models/Note"));
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * Create Razorpay order for multiple notes
 */
const createOrder = async (userId, noteIds) => {
    if (!noteIds || noteIds.length === 0) {
        throw new errorHandler_1.AppError('At least one note is required', 400);
    }
    // Get all notes
    const notes = await Note_1.default.find({ _id: { $in: noteIds }, isActive: true });
    if (notes.length !== noteIds.length) {
        throw new errorHandler_1.AppError('Some notes not found or inactive', 404);
    }
    // Check if user already purchased any of these notes
    const existingOrders = await Order_1.default.find({
        userId,
        'notes.noteId': { $in: noteIds },
        status: 'completed',
    });
    if (existingOrders.length > 0) {
        const purchasedNoteIds = existingOrders.flatMap(order => order.notes.map(n => n.noteId.toString()));
        const alreadyPurchased = noteIds.filter(id => purchasedNoteIds.includes(id));
        if (alreadyPurchased.length > 0) {
            throw new errorHandler_1.AppError('You have already purchased some of these notes', 400);
        }
    }
    // Calculate total amount
    const notesData = notes.map(note => ({
        noteId: note._id,
        price: note.price,
    }));
    const totalAmount = notes.reduce((sum, note) => sum + note.price, 0);
    // Create Razorpay order
    const amountInPaise = Math.round(totalAmount * 100); // Convert to paise
    const razorpayOrder = await razorpay_1.razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
    });
    // Save order to database
    await Order_1.default.create({
        userId,
        notes: notesData,
        totalAmount,
        currency: 'INR',
        razorpayOrderId: razorpayOrder.id,
        status: 'pending',
    });
    return {
        orderId: razorpayOrder.id,
        amount: totalAmount,
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID,
    };
};
exports.createOrder = createOrder;
/**
 * Verify Razorpay payment signature
 */
const verifyPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    // Generate signature
    const generatedSignature = crypto_1.default
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');
    // Verify signature
    if (generatedSignature !== razorpaySignature) {
        // Update order status to failed
        await Order_1.default.findOneAndUpdate({ razorpayOrderId }, { status: 'failed' });
        throw new errorHandler_1.AppError('Payment verification failed', 400);
    }
    // Update order status to completed
    const order = await Order_1.default.findOneAndUpdate({ razorpayOrderId }, {
        status: 'completed',
        razorpayPaymentId,
        razorpaySignature,
        completedAt: new Date(),
    }, { new: true }).populate('notes.noteId', 'title fileUrl fileName');
    return { success: true, order };
};
exports.verifyPayment = verifyPayment;
