const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
  .get(protect, inventoryController.getInventory)
  .post(protect, inventoryController.createIngredient);

router.route('/:id/stock')
  .post(protect, inventoryController.addStock);

router.route('/:id')
  .put(protect, inventoryController.updateIngredient)
  .delete(protect, inventoryController.deleteIngredient);

router.route('/:id/restore')
  .post(protect, inventoryController.restoreIngredient);

module.exports = router;
