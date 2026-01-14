import { Router } from 'express';
import {
  getSubjectsByStream,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subjectController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

/**
 * Subject routes
 */
router.get('/stream/:streamId', getSubjectsByStream);
router.post('/', authenticate, isAdmin, createSubject);
router.put('/:id', authenticate, isAdmin, updateSubject);
router.delete('/:id', authenticate, isAdmin, deleteSubject);

export default router;
