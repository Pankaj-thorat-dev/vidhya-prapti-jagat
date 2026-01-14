import { Response, NextFunction } from 'express';
import Note from '../models/Note';
import Order from '../models/Order';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/errorHandler';
import path from 'path';

/**
 * Get all notes with filters and populated data
 * GET /api/notes
 */
export const getAllNotes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { subjectId, search, boardId, streamId } = req.query;
    const filter: any = { isActive: true };

    if (subjectId) {
      filter.subjectId = subjectId;
    }

    if (search) {
      filter.$text = { $search: search as string };
    }

    let notes = await Note.find(filter)
      .populate({
        path: 'subjectId',
        select: 'name streamId',
        populate: {
          path: 'streamId',
          select: 'name boardId',
          populate: {
            path: 'boardId',
            select: 'name',
          },
        },
      })
      .sort({ createdAt: -1 });

    // Additional filtering by board or stream if provided
    if (boardId) {
      notes = notes.filter(note => {
        const subject: any = note.subjectId;
        return subject?.streamId?.boardId?._id?.toString() === boardId;
      });
    }

    if (streamId) {
      notes = notes.filter(note => {
        const subject: any = note.subjectId;
        return subject?.streamId?._id?.toString() === streamId;
      });
    }

    // Transform data to include board, stream, subject names
    const transformedNotes = notes.map(note => {
      const noteObj: any = note.toObject();
      const subject: any = noteObj.subjectId;
      
      return {
        ...noteObj,
        subject: subject?.name || 'Unknown',
        subjectId: subject?._id,
        stream: subject?.streamId?.name || 'Unknown',
        streamId: subject?.streamId?._id,
        board: subject?.streamId?.boardId?.name || 'Unknown',
        boardId: subject?.streamId?.boardId?._id,
      };
    });

    res.status(200).json({
      success: true,
      count: transformedNotes.length,
      data: transformedNotes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get note by ID with populated data
 * GET /api/notes/:id
 */
export const getNoteById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id).populate({
      path: 'subjectId',
      select: 'name streamId',
      populate: {
        path: 'streamId',
        select: 'name boardId',
        populate: {
          path: 'boardId',
          select: 'name',
        },
      },
    });

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    // Check if user has purchased this note
    let isPurchased = false;
    if (req.user) {
      const order = await Order.findOne({
        userId: req.user.id,
        'notes.noteId': note._id,
        status: 'completed',
      });
      isPurchased = !!order;
    }

    // Transform data
    const noteObj: any = note.toObject();
    const subject: any = noteObj.subjectId;
    
    const transformedNote = {
      ...noteObj,
      subject: subject?.name || 'Unknown',
      subjectId: subject?._id,
      stream: subject?.streamId?.name || 'Unknown',
      streamId: subject?.streamId?._id,
      board: subject?.streamId?.boardId?.name || 'Unknown',
      boardId: subject?.streamId?.boardId?._id,
      isPurchased,
    };

    res.status(200).json({
      success: true,
      data: transformedNote,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new note (Admin only)
 * POST /api/notes
 */
export const createNote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files || !files.file || !files.file[0]) {
      res.status(400).json({
        success: false,
        message: 'Please upload a PDF file',
      });
      return;
    }

    const { title, description, subjectId, price, pages } = req.body;

    if (!title || !description || !subjectId || !price || !pages) {
      res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
      return;
    }

    const noteData: any = {
      title,
      description,
      subjectId,
      price: parseFloat(price),
      pages: parseInt(pages),
      fileUrl: `/uploads/notes/${files.file[0].filename}`,
      fileName: files.file[0].filename,
      createdBy: req.user!.id,
    };

    // Add image if uploaded
    if (files.image && files.image[0]) {
      noteData.previewImage = `/uploads/images/${files.image[0].filename}`;
    }

    const note = await Note.create(noteData);

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update note (Admin only)
 * PUT /api/notes/:id
 */
export const updateNote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updateData: any = { ...req.body };
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files && files.file && files.file[0]) {
      updateData.fileUrl = `/uploads/notes/${files.file[0].filename}`;
      updateData.fileName = files.file[0].filename;
    }

    // Add image if uploaded
    if (files && files.image && files.image[0]) {
      updateData.previewImage = `/uploads/images/${files.image[0].filename}`;
    }

    const note = await Note.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete note (Admin only)
 * DELETE /api/notes/:id
 */
export const deleteNote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Download note (requires purchase)
 * GET /api/notes/:id/download
 */
export const downloadNote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      throw new AppError('Note not found', 404);
    }

    // Check if user purchased this note
    const order = await Order.findOne({
      userId: req.user!.id,
      'notes.noteId': note._id,
      status: 'completed',
    });

    if (!order && req.user!.role !== 'admin') {
      throw new AppError('You must purchase this note to download', 403);
    }

    const filePath = path.join(__dirname, '../../', note.fileUrl);
    res.download(filePath, note.fileName);
  } catch (error) {
    next(error);
  }
};
