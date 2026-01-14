import express from 'express';
import {
  createContact,
  getAllContacts,
  deleteContact,
} from '../controllers/contactController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * Public route - anyone can submit contact form
 */
router.post('/', createContact);

/**
 * Admin routes - require authentication and admin role
 */
router.get('/', authenticate, isAdmin, getAllContacts);
router.delete('/:id', authenticate, isAdmin, deleteContact);

export default router;
