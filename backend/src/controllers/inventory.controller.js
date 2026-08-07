const prisma = require('../utils/prisma');
const sseService = require('../services/sse.service');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
const getInventory = async (req, res) => {
  try {
    const kitchenId = req.user.kitchenId;
    const ingredients = await prisma.ingredient.findMany({
      where: { kitchenId, isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(ingredients);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

// @desc    Create a new ingredient
// @route   POST /api/inventory
// @access  Private
const createIngredient = async (req, res) => {
  try {
    const kitchenId = req.user.kitchenId;
    const { name, category, unit, currentStock, reorderLevel, costPerUnit } = req.body;
    
    const ingredient = await prisma.ingredient.create({
      data: {
        kitchenId,
        name,
        category,
        unit,
        currentStock: parseFloat(currentStock),
        reorderLevel: parseFloat(reorderLevel),
        costPerUnit: parseFloat(costPerUnit)
      }
    });
    
    // Broadcast event
    sseService.broadcast('INVENTORY_UPDATED', { action: 'CREATED', data: ingredient }, kitchenId);
    
    res.status(201).json(ingredient);
  } catch (error) {
    console.error('Error creating ingredient:', error);
    res.status(500).json({ error: 'Failed to create ingredient' });
  }
};

// @desc    Add stock to an ingredient
// @route   POST /api/inventory/:id/stock
// @access  Private
const addStock = async (req, res) => {
  try {
    const kitchenId = req.user.kitchenId;
    const { id } = req.params;
    const { quantity } = req.body;
    
    const ingredient = await prisma.ingredient.update({
      where: { id, kitchenId },
      data: { currentStock: { increment: parseFloat(quantity) } }
    });
    
    // Broadcast event
    sseService.broadcast('INVENTORY_UPDATED', { action: 'STOCK_ADDED', data: ingredient }, kitchenId);
    
    res.json(ingredient);
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ error: 'Failed to add stock' });
  }
};

// @desc    Update an ingredient
// @route   PUT /api/inventory/:id
// @access  Private
const updateIngredient = async (req, res) => {
  try {
    const kitchenId = req.user.kitchenId;
    const { id } = req.params;
    const { name, category, unit, currentStock, reorderLevel, costPerUnit } = req.body;

    const ingredient = await prisma.ingredient.update({
      where: { id, kitchenId },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(unit && { unit }),
        ...(currentStock !== undefined && { currentStock: parseFloat(currentStock) }),
        ...(reorderLevel !== undefined && { reorderLevel: parseFloat(reorderLevel) }),
        ...(costPerUnit !== undefined && { costPerUnit: parseFloat(costPerUnit) })
      }
    });
    
    // Broadcast event
    sseService.broadcast('INVENTORY_UPDATED', { action: 'UPDATED', data: ingredient }, kitchenId);
    
    res.json(ingredient);
  } catch (error) {
    console.error('Error updating ingredient:', error);
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
};

// @desc    Delete an ingredient
// @route   DELETE /api/inventory/:id
// @access  Private
const deleteIngredient = async (req, res) => {
  try {
    const kitchenId = req.user.kitchenId;
    const { id } = req.params;

    // SOFT DELETE
    await prisma.ingredient.update({
      where: { id, kitchenId },
      data: { isActive: false }
    });
    
    // Broadcast event
    sseService.broadcast('INVENTORY_UPDATED', { action: 'DELETED', id }, kitchenId);
    
    res.json({ message: 'Ingredient moved to trash', id });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    res.status(500).json({ error: 'Failed to delete ingredient' });
  }
};

// @desc    Restore a softly deleted ingredient
// @route   POST /api/inventory/:id/restore
// @access  Private
const restoreIngredient = async (req, res) => {
  try {
    const kitchenId = req.user.kitchenId;
    const { id } = req.params;

    const ingredient = await prisma.ingredient.update({
      where: { id, kitchenId },
      data: { isActive: true }
    });

    sseService.broadcast('INVENTORY_UPDATED', { action: 'RESTORED', data: ingredient }, kitchenId);

    res.json({ message: 'Ingredient restored successfully', ingredient });
  } catch (error) {
    console.error('Error restoring ingredient:', error);
    res.status(500).json({ error: 'Failed to restore ingredient' });
  }
};

module.exports = {
  getInventory,
  createIngredient,
  addStock,
  updateIngredient,
  deleteIngredient,
  restoreIngredient
};
