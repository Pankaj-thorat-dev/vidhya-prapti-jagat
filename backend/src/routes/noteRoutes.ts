import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  downloadNote,
} from '../controllers/noteController';
import { authenticate, isAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

/**
 * Note routes
 */
router.get('/', getAllNotes);
router.get('/:id', authenticate, getNoteById);
router.get('/:id/download', authenticate, downloadNote);
router.post('/', authenticate, isAdmin, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), createNote);
router.put('/:id', authenticate, isAdmin, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), updateNote);
router.delete('/:id', authenticate, isAdmin, deleteNote);

export default router;
