const express = require('express');
const router = express.Router();
const c = require('../controllers/supplier.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/purchase-orders',  protect, c.getPurchaseOrders);
router.post('/purchase-orders', protect, c.createPurchaseOrder);

router.get('/',      protect, c.getSuppliers);
router.post('/',     protect, c.createSupplier);
router.put('/:id',   protect, c.updateSupplier);
router.delete('/:id',protect, c.deleteSupplier);

module.exports = router;
