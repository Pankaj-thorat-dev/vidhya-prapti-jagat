"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * Order routes
 */
router.post('/create', auth_1.authenticate, orderController_1.createNewOrder);
router.post('/verify', auth_1.authenticate, orderController_1.verifyOrderPayment);
router.get('/my-orders', auth_1.authenticate, orderController_1.getMyOrders);
router.get('/admin/stats', auth_1.authenticate, auth_1.isAdmin, orderController_1.getAdminStats);
router.get('/', auth_1.authenticate, auth_1.isAdmin, orderController_1.getAllOrders);
router.get('/:id', auth_1.authenticate, orderController_1.getOrderById);
exports.default = router;
