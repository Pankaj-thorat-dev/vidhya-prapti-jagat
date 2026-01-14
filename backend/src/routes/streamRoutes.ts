import { Router } from 'express';
import {
  getStreamsByBoard,
  getStreamById,
  createStream,
  updateStream,
  deleteStream,
} from '../controllers/streamController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

/**
 * Stream routes
 */
router.get('/board/:boardId', getStreamsByBoard);
router.get('/:id', getStreamById);
router.post('/', authenticate, isAdmin, createStream);
router.put('/:id', authenticate, isAdmin, updateStream);
router.delete('/:id', authenticate, isAdmin, deleteStream);

export default router;
