"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStream = exports.updateStream = exports.createStream = exports.getStreamById = exports.getStreamsByBoard = void 0;
const Stream_1 = __importDefault(require("../models/Stream"));
const Subject_1 = __importDefault(require("../models/Subject"));
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * Get streams by board
 * GET /api/streams/board/:boardId
 */
const getStreamsByBoard = async (req, res, next) => {
    try {
        const streams = await Stream_1.default.find({
            boardId: req.params.boardId,
            isActive: true,
        }).sort({ name: 1 });
        res.status(200).json({
            success: true,
            count: streams.length,
            data: streams,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStreamsByBoard = getStreamsByBoard;
/**
 * Get stream by ID with subjects
 * GET /api/streams/:id
 */
const getStreamById = async (req, res, next) => {
    try {
        const stream = await Stream_1.default.findById(req.params.id);
        if (!stream) {
            throw new errorHandler_1.AppError('Stream not found', 404);
        }
        const subjects = await Subject_1.default.find({ streamId: stream._id, isActive: true });
        res.status(200).json({
            success: true,
            data: { stream, subjects },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStreamById = getStreamById;
/**
 * Create new stream (Admin only)
 * POST /api/streams
 */
const createStream = async (req, res, next) => {
    try {
        const { name, boardId, description } = req.body;
        if (!name || !boardId) {
            res.status(400).json({
                success: false,
                message: 'Stream name and board are required',
            });
            return;
        }
        const stream = await Stream_1.default.create({ name, boardId, description });
        res.status(201).json({
            success: true,
            message: 'Stream created successfully',
            data: stream,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createStream = createStream;
/**
 * Update stream (Admin only)
 * PUT /api/streams/:id
 */
const updateStream = async (req, res, next) => {
    try {
        const stream = await Stream_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!stream) {
            throw new errorHandler_1.AppError('Stream not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'Stream updated successfully',
            data: stream,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateStream = updateStream;
/**
 * Delete stream (Admin only)
 * DELETE /api/streams/:id
 */
const deleteStream = async (req, res, next) => {
    try {
        const stream = await Stream_1.default.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!stream) {
            throw new errorHandler_1.AppError('Stream not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'Stream deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteStream = deleteStream;
