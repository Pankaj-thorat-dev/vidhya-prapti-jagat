import { Request, Response, NextFunction } from 'express';
import Stream from '../models/Stream';
import Subject from '../models/Subject';
import { AppError } from '../middleware/errorHandler';

/**
 * Get streams by board
 * GET /api/streams/board/:boardId
 */
export const getStreamsByBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const streams = await Stream.find({
      boardId: req.params.boardId,
      isActive: true,
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: streams.length,
      data: streams,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get stream by ID with subjects
 * GET /api/streams/:id
 */
export const getStreamById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) {
      throw new AppError('Stream not found', 404);
    }

    const subjects = await Subject.find({ streamId: stream._id, isActive: true });

    res.status(200).json({
      success: true,
      data: { stream, subjects },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new stream (Admin only)
 * POST /api/streams
 */
export const createStream = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, boardId, description } = req.body;

    if (!name || !boardId) {
      res.status(400).json({
        success: false,
        message: 'Stream name and board are required',
      });
      return;
    }

    const stream = await Stream.create({ name, boardId, description });

    res.status(201).json({
      success: true,
      message: 'Stream created successfully',
      data: stream,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update stream (Admin only)
 * PUT /api/streams/:id
 */
export const updateStream = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stream = await Stream.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!stream) {
      throw new AppError('Stream not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Stream updated successfully',
      data: stream,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete stream (Admin only)
 * DELETE /api/streams/:id
 */
export const deleteStream = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stream = await Stream.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!stream) {
      throw new AppError('Stream not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Stream deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
