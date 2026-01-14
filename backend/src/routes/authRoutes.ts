import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * Auth routes
 */
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

export default router;
