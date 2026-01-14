import crypto from 'crypto';
import { razorpayInstance } from '../config/razorpay';
import Order from '../models/Order';
import Note from '../models/Note';
import { AppError } from '../middleware/errorHandler';

/**
 * Create Razorpay order for multiple notes
 */
export const createOrder = async (
  userId: string,
  noteIds: string[]
): Promise<{ orderId: string; amount: number; currency: string; key: string }> => {
  if (!noteIds || noteIds.length === 0) {
    throw new AppError('At least one note is required', 400);
  }

  // Get all notes
  const notes = await Note.find({ _id: { $in: noteIds }, isActive: true });
  
  if (notes.length !== noteIds.length) {
    throw new AppError('Some notes not found or inactive', 404);
  }

  // Check if user already purchased any of these notes
  const existingOrders = await Order.find({
    userId,
    'notes.noteId': { $in: noteIds },
    status: 'completed',
  });

  if (existingOrders.length > 0) {
    const purchasedNoteIds = existingOrders.flatMap(order => 
      order.notes.map(n => n.noteId.toString())
    );
    const alreadyPurchased = noteIds.filter(id => purchasedNoteIds.includes(id));
    
    if (alreadyPurchased.length > 0) {
      throw new AppError('You have already purchased some of these notes', 400);
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
  
  try {
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // Save order to database
    await Order.create({
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
      key: process.env.RAZORPAY_KEY_ID as string,
    };
  } catch (error: any) {
    console.error('Razorpay API Error:', error);
    
    // Provide user-friendly error message
    if (error.error && error.error.description) {
      throw new AppError(`Payment gateway error: ${error.error.description}`, 500);
    } else if (error.message && error.message.includes('api key')) {
      throw new AppError('Payment gateway not configured. Please contact administrator.', 500);
    } else {
      throw new AppError('Unable to create order. Please try again later.', 500);
    }
  }
};

/**
 * Verify Razorpay payment signature
 */
export const verifyPayment = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<{ success: boolean; order: any }> => {
  // Verify signature
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (generatedSignature !== razorpaySignature) {
    // Update order status to failed
    await Order.findOneAndUpdate(
      { razorpayOrderId },
      { status: 'failed' }
    );
    throw new AppError('Payment verification failed', 400);
  }

  // Update order status to completed
  const order = await Order.findOneAndUpdate(
    { razorpayOrderId },
    {
      status: 'completed',
      razorpayPaymentId,
      razorpaySignature,
      completedAt: new Date(),
    },
    { new: true }
  ).populate('notes.noteId', 'title fileUrl fileName');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return { success: true, order };
};
