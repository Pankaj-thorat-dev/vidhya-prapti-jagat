"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const streamController_1 = require("../controllers/streamController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * Stream routes
 */
router.get('/board/:boardId', streamController_1.getStreamsByBoard);
router.get('/:id', streamController_1.getStreamById);
router.post('/', auth_1.authenticate, auth_1.isAdmin, streamController_1.createStream);
router.put('/:id', auth_1.authenticate, auth_1.isAdmin, streamController_1.updateStream);
router.delete('/:id', auth_1.authenticate, auth_1.isAdmin, streamController_1.deleteStream);
exports.default = router;
