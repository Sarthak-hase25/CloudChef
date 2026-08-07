const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
  .get(protect, menuController.getMenu)
  .post(protect, menuController.createMenuItem);

router.route('/:id')
  .put(protect, menuController.updateMenuItem)
  .delete(protect, menuController.deleteMenuItem);

router.route('/:id/restore')
  .post(protect, menuController.restoreMenuItem);

module.exports = router;
