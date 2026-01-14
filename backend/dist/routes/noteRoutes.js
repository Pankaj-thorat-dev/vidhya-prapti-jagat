"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const noteController_1 = require("../controllers/noteController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
/**
 * Note routes
 */
router.get('/', noteController_1.getAllNotes);
router.get('/:id', auth_1.authenticate, noteController_1.getNoteById);
router.get('/:id/download', auth_1.authenticate, noteController_1.downloadNote);
router.post('/', auth_1.authenticate, auth_1.isAdmin, upload_1.upload.single('file'), noteController_1.createNote);
router.put('/:id', auth_1.authenticate, auth_1.isAdmin, upload_1.upload.single('file'), noteController_1.updateNote);
router.delete('/:id', auth_1.authenticate, auth_1.isAdmin, noteController_1.deleteNote);
exports.default = router;
