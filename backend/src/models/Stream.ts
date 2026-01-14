import mongoose, { Document, Schema } from 'mongoose';

/**
 * Stream document interface (e.g., Science, Commerce, Arts)
 */
export interface IStream extends Document {
  name: string;
  boardId: mongoose.Types.ObjectId;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

const streamSchema = new Schema<IStream>(
  {
    name: {
      type: String,
      required: [true, 'Stream name is required'],
      trim: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
      required: [true, 'Board is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IStream>('Stream', streamSchema);
