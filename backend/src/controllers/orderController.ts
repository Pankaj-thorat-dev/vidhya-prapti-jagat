import { Response, NextFunction } from 'express';
import Order from '../models/Order';
import Contact from '../models/Contact';
import { AuthRequest } from '../types';
import { createOrder, verifyPayment } from '../services/paymentService';
import User from '../models/User';
import Note from '../models/Note';

/**
 * Get admin statistics
 * GET /api/orders/admin/stats
 */
export const getAdminStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [totalUsers, totalNotes, totalOrders, completedOrders, totalContacts] = await Promise.all([
      User.countDocuments(),
      Note.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.find({ status: 'completed' }),
      Contact.countDocuments(),
    ]);

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalNotes,
        totalOrders,
        completedOrders: completedOrders.length,
        pendingOrders,
        totalRevenue,
        totalContacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new order for multiple notes
 * POST /api/orders/create
 */
export const createNewOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { noteIds } = req.body;

    if (!noteIds || !Array.isArray(noteIds) || noteIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Note IDs array is required',
      });
      return;
    }

    const orderData = await createOrder(req.user!.id, noteIds);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: orderData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify payment
 * POST /api/orders/verify
 */
export const verifyOrderPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      res.status(400).json({
        success: false,
        message: 'All payment details are required',
      });
      return;
    }

    const result = await verifyPayment(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: result.order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user orders with populated note details
 * GET /api/orders/my-orders
 */
export const getMyOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await Order.find({ userId: req.user!.id })
      .populate('notes.noteId', 'title price fileUrl fileName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders (Admin only)
 * GET /api/orders
 */
export const getAllOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('notes.noteId', 'title price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by ID
 * GET /api/orders/:id
 */
export const getOrderById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
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
    if (
      order.userId._id.toString() !== req.user!.id &&
      req.user!.role !== 'admin'
    ) {
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
  } catch (error) {
    next(error);
  }
};
