const prisma = require('../utils/prisma');
const sseService = require('../services/sse.service');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
const getSuppliers = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  const { search } = req.query;

  const suppliers = await prisma.supplier.findMany({
    where: {
      kitchenId,
      isActive: true,
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {})
    },
    include: {
      purchaseOrders: {
        where: { status: { in: ['PENDING', 'ORDERED'] } },
        select: { id: true, status: true, totalAmount: true, expectedDelivery: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  res.json(suppliers);
});

// @desc    Create a supplier
// @route   POST /api/suppliers
// @access  Private
const createSupplier = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  const { name, contactPerson, email, phone, address } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Supplier name is required');
  }

  // Duplicate check
  const existing = await prisma.supplier.findFirst({
    where: { kitchenId, name: { equals: name, mode: 'insensitive' }, isActive: true }
  });
  if (existing) {
    res.status(409);
    throw new Error(`Supplier '${name}' already exists`);
  }

  const supplier = await prisma.supplier.create({
    data: { kitchenId, name, contactPerson, email, phone, address }
  });

  sseService.broadcast('SUPPLIER_UPDATED', { action: 'CREATED', data: supplier }, kitchenId);
  res.status(201).json(supplier);
});

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private
const updateSupplier = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  const { id } = req.params;
  const updates = req.body;

  const supplier = await prisma.supplier.update({
    where: { id, kitchenId },
    data: updates
  });

  sseService.broadcast('SUPPLIER_UPDATED', { action: 'UPDATED', data: supplier }, kitchenId);
  res.json(supplier);
});

// @desc    Soft delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
const deleteSupplier = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  const { id } = req.params;

  await prisma.supplier.update({
    where: { id, kitchenId },
    data: { isActive: false }
  });

  sseService.broadcast('SUPPLIER_UPDATED', { action: 'DELETED', id }, kitchenId);
  res.json({ message: 'Supplier deactivated', id });
});

// @desc    Get purchase orders
// @route   GET /api/suppliers/purchase-orders
// @access  Private
const getPurchaseOrders = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  const pos = await prisma.purchaseOrder.findMany({
    where: { kitchenId },
    include: { supplier: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  res.json(pos);
});

// @desc    Create a purchase order
// @route   POST /api/suppliers/purchase-orders
// @access  Private
const createPurchaseOrder = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  const { supplierId, items, expectedDelivery, notes } = req.body;

  if (!supplierId || !items?.length) {
    res.status(400);
    throw new Error('Supplier and at least one item are required');
  }

  const totalAmount = items.reduce((s, i) => s + (parseFloat(i.unitPrice) * parseInt(i.quantity)), 0);

  const po = await prisma.purchaseOrder.create({
    data: {
      kitchenId,
      supplierId,
      totalAmount,
      expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
      notes,
      status: 'PENDING',
      items: {
        create: items.map(i => ({
          ingredientId: i.ingredientId,
          quantity:     parseFloat(i.quantity),
          unitPrice:    parseFloat(i.unitPrice),
          totalPrice:   parseFloat(i.quantity) * parseFloat(i.unitPrice),
        }))
      }
    },
    include: {
      supplier: { select: { id: true, name: true } },
      items: true
    }
  });

  sseService.broadcast('SUPPLIER_UPDATED', { action: 'PO_CREATED', data: po }, kitchenId);
  res.status(201).json(po);
});

module.exports = { getSuppliers, createSupplier, updateSupplier, deleteSupplier, getPurchaseOrders, createPurchaseOrder };
