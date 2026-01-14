import mongoose, { Document, Schema } from 'mongoose';

/**
 * Board document interface (e.g., CBSE, ICSE, State Boards)
 */
export interface IBoard extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

const boardSchema = new Schema<IBoard>(
  {
    name: {
      type: String,
      required: [true, 'Board name is required'],
      unique: true,
      trim: true,
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

export default mongoose.model<IBoard>('Board', boardSchema);
