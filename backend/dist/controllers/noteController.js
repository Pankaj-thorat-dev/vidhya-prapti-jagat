"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadNote = exports.deleteNote = exports.updateNote = exports.createNote = exports.getNoteById = exports.getAllNotes = void 0;
const Note_1 = __importDefault(require("../models/Note"));
const Order_1 = __importDefault(require("../models/Order"));
const errorHandler_1 = require("../middleware/errorHandler");
const path_1 = __importDefault(require("path"));
/**
 * Get all notes with filters and populated data
 * GET /api/notes
 */
const getAllNotes = async (req, res, next) => {
    try {
        const { subjectId, search, boardId, streamId } = req.query;
        const filter = { isActive: true };
        if (subjectId) {
            filter.subjectId = subjectId;
        }
        if (search) {
            filter.$text = { $search: search };
        }
        let notes = await Note_1.default.find(filter)
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
                const subject = note.subjectId;
                return subject?.streamId?.boardId?._id?.toString() === boardId;
            });
        }
        if (streamId) {
            notes = notes.filter(note => {
                const subject = note.subjectId;
                return subject?.streamId?._id?.toString() === streamId;
            });
        }
        // Transform data to include board, stream, subject names
        const transformedNotes = notes.map(note => {
            const noteObj = note.toObject();
            const subject = noteObj.subjectId;
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
    }
    catch (error) {
        next(error);
    }
};
exports.getAllNotes = getAllNotes;
/**
 * Get note by ID with populated data
 * GET /api/notes/:id
 */
const getNoteById = async (req, res, next) => {
    try {
        const note = await Note_1.default.findById(req.params.id).populate({
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
            throw new errorHandler_1.AppError('Note not found', 404);
        }
        // Check if user has purchased this note
        let isPurchased = false;
        if (req.user) {
            const order = await Order_1.default.findOne({
                userId: req.user.id,
                'notes.noteId': note._id,
                status: 'completed',
            });
            isPurchased = !!order;
        }
        // Transform data
        const noteObj = note.toObject();
        const subject = noteObj.subjectId;
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
    }
    catch (error) {
        next(error);
    }
};
exports.getNoteById = getNoteById;
/**
 * Create new note (Admin only)
 * POST /api/notes
 */
const createNote = async (req, res, next) => {
    try {
        if (!req.file) {
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
        const note = await Note_1.default.create({
            title,
            description,
            subjectId,
            price: parseFloat(price),
            pages: parseInt(pages),
            fileUrl: `/uploads/notes/${req.file.filename}`,
            fileName: req.file.filename,
            createdBy: req.user.id,
        });
        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            data: note,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createNote = createNote;
/**
 * Update note (Admin only)
 * PUT /api/notes/:id
 */
const updateNote = async (req, res, next) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.fileUrl = `/uploads/notes/${req.file.filename}`;
            updateData.fileName = req.file.filename;
        }
        const note = await Note_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!note) {
            throw new errorHandler_1.AppError('Note not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'Note updated successfully',
            data: note,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateNote = updateNote;
/**
 * Delete note (Admin only)
 * DELETE /api/notes/:id
 */
const deleteNote = async (req, res, next) => {
    try {
        const note = await Note_1.default.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!note) {
            throw new errorHandler_1.AppError('Note not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'Note deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteNote = deleteNote;
/**
 * Download note (requires purchase)
 * GET /api/notes/:id/download
 */
const downloadNote = async (req, res, next) => {
    try {
        const note = await Note_1.default.findById(req.params.id);
        if (!note) {
            throw new errorHandler_1.AppError('Note not found', 404);
        }
        // Check if user purchased this note
        const order = await Order_1.default.findOne({
            userId: req.user.id,
            'notes.noteId': note._id,
            status: 'completed',
        });
        if (!order && req.user.role !== 'admin') {
            throw new errorHandler_1.AppError('You must purchase this note to download', 403);
        }
        const filePath = path_1.default.join(__dirname, '../../', note.fileUrl);
        res.download(filePath, note.fileName);
    }
    catch (error) {
        next(error);
    }
};
exports.downloadNote = downloadNote;
