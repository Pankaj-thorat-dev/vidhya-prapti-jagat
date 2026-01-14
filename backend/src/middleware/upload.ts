import multer from 'multer';
import path from 'path';
import { Request } from 'express';

/**
 * Configure multer for PDF file uploads
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, 'uploads/images/');
    } else {
      cb(null, 'uploads/notes/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    if (file.fieldname === 'image') {
      cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
    } else {
      cb(null, 'note-' + uniqueSuffix + path.extname(file.originalname));
    }
  },
});

/**
 * File filter to accept PDFs and images
 */
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.fieldname === 'file' && file.mimetype === 'application/pdf') {
    cb(null, true);
  } else if (file.fieldname === 'image' && 
    (file.mimetype === 'image/jpeg' || 
     file.mimetype === 'image/png' || 
     file.mimetype === 'image/webp')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

/**
 * Multer upload middleware
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
});
