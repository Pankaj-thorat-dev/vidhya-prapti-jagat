import { Request, Response, NextFunction } from 'express';
import Subject from '../models/Subject';
import { AppError } from '../middleware/errorHandler';

/**
 * Get subjects by stream
 * GET /api/subjects/stream/:streamId
 */
export const getSubjectsByStream = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const subjects = await Subject.find({
      streamId: req.params.streamId,
      isActive: true,
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new subject (Admin only)
 * POST /api/subjects
 */
export const createSubject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, streamId, description } = req.body;

    if (!name || !streamId) {
      res.status(400).json({
        success: false,
        message: 'Subject name and stream are required',
      });
      return;
    }

    const subject = await Subject.create({ name, streamId, description });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update subject (Admin only)
 * PUT /api/subjects/:id
 */
export const updateSubject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!subject) {
      throw new AppError('Subject not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete subject (Admin only)
 * DELETE /api/subjects/:id
 */
export const deleteSubject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!subject) {
      throw new AppError('Subject not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
