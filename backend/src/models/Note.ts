import mongoose, { Document, Schema } from 'mongoose';

/**
 * Note document interface
 */
export interface INote extends Document {
  title: string;
  description: string;
  subjectId: mongoose.Types.ObjectId;
  price: number;
  pages: number;
  fileUrl: string;
  fileName: string;
  previewImage?: string;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    pages: {
      type: Number,
      required: [true, 'Number of pages is required'],
      min: 1,
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    previewImage: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
noteSchema.index({ subjectId: 1, isActive: 1 });
noteSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<INote>('Note', noteSchema);
