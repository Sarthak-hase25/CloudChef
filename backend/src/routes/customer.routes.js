const express = require('express');
const router = express.Router();
const c = require('../controllers/customer.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/',           protect, c.getCustomers);
router.post('/',          protect, c.createCustomer);
router.put('/:id',        protect, c.updateCustomer);
router.delete('/:id',     protect, c.deleteCustomer);
router.get('/:id/orders', protect, c.getCustomerOrders);

module.exports = router;
