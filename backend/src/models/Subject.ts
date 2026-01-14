import mongoose, { Document, Schema } from 'mongoose';

/**
 * Subject document interface
 */
export interface ISubject extends Document {
  name: string;
  streamId: mongoose.Types.ObjectId;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    streamId: {
      type: Schema.Types.ObjectId,
      ref: 'Stream',
      required: [true, 'Stream is required'],
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

export default mongoose.model<ISubject>('Subject', subjectSchema);
