"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoard = exports.updateBoard = exports.createBoard = exports.getBoardById = exports.getAllBoards = void 0;
const Board_1 = __importDefault(require("../models/Board"));
const Stream_1 = __importDefault(require("../models/Stream"));
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * Get all boards
 * GET /api/boards
 */
const getAllBoards = async (req, res, next) => {
    try {
        const boards = await Board_1.default.find({ isActive: true }).sort({ name: 1 });
        res.status(200).json({
            success: true,
            count: boards.length,
            data: boards,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllBoards = getAllBoards;
/**
 * Get board by ID with streams
 * GET /api/boards/:id
 */
const getBoardById = async (req, res, next) => {
    try {
        const board = await Board_1.default.findById(req.params.id);
        if (!board) {
            throw new errorHandler_1.AppError('Board not found', 404);
        }
        const streams = await Stream_1.default.find({ boardId: board._id, isActive: true });
        res.status(200).json({
            success: true,
            data: { board, streams },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getBoardById = getBoardById;
/**
 * Create new board (Admin only)
 * POST /api/boards
 */
const createBoard = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            res.status(400).json({
                success: false,
                message: 'Board name is required',
            });
            return;
        }
        const board = await Board_1.default.create({ name, description });
        res.status(201).json({
            success: true,
            message: 'Board created successfully',
            data: board,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createBoard = createBoard;
/**
 * Update board (Admin only)
 * PUT /api/boards/:id
 */
const updateBoard = async (req, res, next) => {
    try {
        const board = await Board_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!board) {
            throw new errorHandler_1.AppError('Board not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'Board updated successfully',
            data: board,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateBoard = updateBoard;
/**
 * Delete board (Admin only)
 * DELETE /api/boards/:id
 */
const deleteBoard = async (req, res, next) => {
    try {
        const board = await Board_1.default.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!board) {
            throw new errorHandler_1.AppError('Board not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'Board deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBoard = deleteBoard;
