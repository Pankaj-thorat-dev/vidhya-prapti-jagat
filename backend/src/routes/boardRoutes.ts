import { Router } from 'express';
import {
  getAllBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
} from '../controllers/boardController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

/**
 * Board routes
 */
router.get('/', getAllBoards);
router.get('/:id', getBoardById);
router.post('/', authenticate, isAdmin, createBoard);
router.put('/:id', authenticate, isAdmin, updateBoard);
router.delete('/:id', authenticate, isAdmin, deleteBoard);

export default router;
