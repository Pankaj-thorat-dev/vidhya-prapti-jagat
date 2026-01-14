import { Router } from 'express';
import {
  createNewOrder,
  verifyOrderPayment,
  getMyOrders,
  getAllOrders,
  getOrderById,
  getAdminStats,
} from '../controllers/orderController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

/**
 * Order routes
 */
router.post('/create', authenticate, createNewOrder);
router.post('/verify', authenticate, verifyOrderPayment);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/admin/stats', authenticate, isAdmin, getAdminStats);
router.get('/', authenticate, isAdmin, getAllOrders);
router.get('/:id', authenticate, getOrderById);

export default router;
