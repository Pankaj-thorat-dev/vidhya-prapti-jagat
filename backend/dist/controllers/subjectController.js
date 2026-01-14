"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubject = exports.updateSubject = exports.createSubject = exports.getSubjectsByStream = void 0;
const Subject_1 = __importDefault(require("../models/Subject"));
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * Get subjects by stream
 * GET /api/subjects/stream/:streamId
 */
const getSubjectsByStream = async (req, res, next) => {
    try {
        const subjects = await Subject_1.default.find({
            streamId: req.params.streamId,
            isActive: true,
        }).sort({ name: 1 });
        res.status(200).json({
            success: true,
            count: subjects.length,
            data: subjects,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getSubjectsByStream = getSubjectsByStream;
/**
 * Create new subject (Admin only)
 * POST /api/subjects
 */
const createSubject = async (req, res, next) => {
    try {
        const { name, streamId, description } = req.body;
        if (!name || !streamId) {
            res.status(400).json({
                success: false,
                message: 'Subject name and stream are required',
            });
            return;
        }
        const subject = await Subject_1.default.create({ name, streamId, description });
        res.status(201).json({
            success: true,
            message: 'Subject created successfully',
            data: subject,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createSubject = createSubject;
/**
 * Update subject (Admin only)
 * PUT /api/subjects/:id
 */
const updateSubject = async (req, res, next) => {
    try {
        const subject = await Subject_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!subject) {
            throw new errorHandler_1.AppError('Subject not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'Subject updated successfully',
            data: subject,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSubject = updateSubject;
/**
 * Delete subject (Admin only)
 * DELETE /api/subjects/:id
 */
const deleteSubject = async (req, res, next) => {
    try {
        const subject = await Subject_1.default.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!subject) {
            throw new errorHandler_1.AppError('Subject not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'Subject deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSubject = deleteSubject;
