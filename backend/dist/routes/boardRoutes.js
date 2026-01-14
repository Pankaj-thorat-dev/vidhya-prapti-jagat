"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const boardController_1 = require("../controllers/boardController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * Board routes
 */
router.get('/', boardController_1.getAllBoards);
router.get('/:id', boardController_1.getBoardById);
router.post('/', auth_1.authenticate, auth_1.isAdmin, boardController_1.createBoard);
router.put('/:id', auth_1.authenticate, auth_1.isAdmin, boardController_1.updateBoard);
router.delete('/:id', auth_1.authenticate, auth_1.isAdmin, boardController_1.deleteBoard);
exports.default = router;
