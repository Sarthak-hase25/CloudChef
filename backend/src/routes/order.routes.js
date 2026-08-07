const express = require('express');
const router = express.Router();
const c = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/live-queue',   protect, c.getLiveQueue);
router.get('/',             protect, c.getOrders);
router.patch('/:id/status', protect, c.updateOrderStatus);
router.patch('/:id/cancel', protect, c.cancelOrder);

module.exports = router;
