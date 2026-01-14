import { Request, Response, NextFunction } from 'express';
import Board from '../models/Board';
import Stream from '../models/Stream';
import { AppError } from '../middleware/errorHandler';

/**
 * Get all boards
 * GET /api/boards
 */
export const getAllBoards = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const boards = await Board.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: boards.length,
      data: boards,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get board by ID with streams
 * GET /api/boards/:id
 */
export const getBoardById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      throw new AppError('Board not found', 404);
    }

    const streams = await Stream.find({ boardId: board._id, isActive: true });

    res.status(200).json({
      success: true,
      data: { board, streams },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new board (Admin only)
 * POST /api/boards
 */
export const createBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Board name is required',
      });
      return;
    }

    const board = await Board.create({ name, description });

    res.status(201).json({
      success: true,
      message: 'Board created successfully',
      data: board,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update board (Admin only)
 * PUT /api/boards/:id
 */
export const updateBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!board) {
      throw new AppError('Board not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Board updated successfully',
      data: board,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete board (Admin only)
 * DELETE /api/boards/:id
 */
export const deleteBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const board = await Board.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!board) {
      throw new AppError('Board not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Board deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
