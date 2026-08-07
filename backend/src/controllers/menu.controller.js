const prisma = require('../utils/prisma');
const sseService = require('../services/sse.service');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all menu items and categories
// @route   GET /api/menu
// @access  Private
const getMenu = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  
  // Using Prisma transaction for performance
  const [categories, items] = await prisma.$transaction([
    prisma.menuCategory.findMany({
      where: { kitchenId, isActive: true },
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.menuItem.findMany({
      where: { kitchenId, isAvailable: true },
      include: { category: true },
      orderBy: { name: 'asc' }
    })
  ]);

  res.json({ categories, items });
});

// @desc    Create a new menu item
// @route   POST /api/menu
// @access  Private
const createMenuItem = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  const { categoryName, name, description, price, prepTimeMinutes, isVeg, tags } = req.body;

  // 1. Duplicate Check
  const existingItem = await prisma.menuItem.findFirst({
    where: { kitchenId, name: { equals: name, mode: 'insensitive' } }
  });

  if (existingItem) {
    res.status(409);
    throw new Error(`Menu item '${name}' already exists.`);
  }

  // 2. Find or create the category (Transaction safe)
  let category = await prisma.menuCategory.findFirst({
    where: { kitchenId, name: categoryName }
  });

  if (!category) {
    category = await prisma.menuCategory.create({
      data: { kitchenId, name: categoryName }
    });
  }

  // 3. Create Item
  const menuItem = await prisma.menuItem.create({
    data: {
      kitchenId,
      categoryId: category.id,
      name,
      description,
      price: parseFloat(price),
      prepTimeMinutes: parseInt(prepTimeMinutes) || 15,
      isVeg: isVeg ?? true,
      tags: tags || []
    },
    include: { category: true }
  });

  sseService.broadcast('MENU_UPDATED', { action: 'CREATED', data: menuItem }, kitchenId);
  res.status(201).json(menuItem);
});

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private
const updateMenuItem = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  const { id } = req.params;
  const updates = req.body;

  if (updates.price !== undefined) updates.price = parseFloat(updates.price);
  if (updates.prepTimeMinutes !== undefined) updates.prepTimeMinutes = parseInt(updates.prepTimeMinutes);

  const menuItem = await prisma.menuItem.update({
    where: { id, kitchenId }, // Enforce tenant isolation
    data: {
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.price !== undefined && { price: updates.price }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.isAvailable !== undefined && { isAvailable: updates.isAvailable }),
        ...(updates.isVeg !== undefined && { isVeg: updates.isVeg })
    },
    include: { category: true }
  });

  sseService.broadcast('MENU_UPDATED', { action: 'UPDATED', data: menuItem }, kitchenId);
  res.json(menuItem);
});

// @desc    Soft Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private
const deleteMenuItem = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  const { id } = req.params;

  // Soft Delete
  await prisma.menuItem.update({
    where: { id, kitchenId },
    data: { isAvailable: false } 
  });

  sseService.broadcast('MENU_UPDATED', { action: 'DELETED', id }, kitchenId);
  res.json({ message: 'Menu item moved to archive', id });
});

// @desc    Restore a menu item
// @route   POST /api/menu/:id/restore
// @access  Private
const restoreMenuItem = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  const { id } = req.params;

  const menuItem = await prisma.menuItem.update({
    where: { id, kitchenId },
    data: { isAvailable: true },
    include: { category: true }
  });

  sseService.broadcast('MENU_UPDATED', { action: 'RESTORED', data: menuItem }, kitchenId);
  res.json(menuItem);
});

module.exports = {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  restoreMenuItem
};
