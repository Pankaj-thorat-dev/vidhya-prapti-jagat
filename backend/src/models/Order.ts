import mongoose, { Document, Schema } from 'mongoose';

/**
 * Order document interface - supports multiple notes per order
 */
export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  notes: Array<{
    noteId: mongoose.Types.ObjectId;
    price: number;
  }>;
  totalAmount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    notes: [
      {
        noteId: {
          type: Schema.Types.ObjectId,
          ref: 'Note',
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    razorpayOrderId: {
      type: String,
      required: [true, 'Razorpay order ID is required'],
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ 'notes.noteId': 1 });

export default mongoose.model<IOrder>('Order', orderSchema);
