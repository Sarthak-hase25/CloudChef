const prisma = require('../utils/prisma');
const sseService = require('../services/sse.service');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  const { status, limit = 50, page = 1 } = req.query;

  const where = {
    kitchenId,
    ...(status && status !== 'All' ? { status } : {})
  };

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        items: {
          include: { menuItem: { select: { id: true, name: true, price: true } } }
        }
      },
      orderBy: { placedAt: 'desc' },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    }),
    prisma.order.count({ where })
  ]);

  res.json({ orders, total, page: parseInt(page), limit: parseInt(limit) });
});

// @desc    Get live order queue (Pending + Preparing + Ready)
// @route   GET /api/orders/live-queue
// @access  Private
const getLiveQueue = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  const orders = await prisma.order.findMany({
    where: { kitchenId, status: { in: ['PENDING', 'PREPARING', 'READY'] } },
    include: {
      customer: { select: { id: true, name: true, phone: true } },
      items: {
        include: { menuItem: { select: { id: true, name: true } } }
      }
    },
    orderBy: { placedAt: 'asc' },
  });
  res.json(orders);
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
const updateOrderStatus = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const timestamps = {
    PREPARING: { confirmedAt: new Date() },
    READY:     { preparedAt: new Date() },
    DELIVERED: { deliveredAt: new Date() },
    CANCELLED: { cancelledAt: new Date() },
  };

  const order = await prisma.order.update({
    where: { id, kitchenId },
    data: { status, ...(timestamps[status] || {}) },
    include: {
      customer: { select: { id: true, name: true, phone: true } },
      items: {
        include: { menuItem: { select: { id: true, name: true } } }
      }
    }
  });

  sseService.broadcast('ORDER_UPDATED', { action: 'STATUS_CHANGED', data: order }, kitchenId);
  res.json(order);
});

// @desc    Cancel an order (shorthand for status update)
// @route   PATCH /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const kitchenId = req.user.kitchenId;
  const { id } = req.params;

  const order = await prisma.order.update({
    where: { id, kitchenId },
    data: { status: 'CANCELLED', cancelledAt: new Date() },
    include: { customer: true }
  });

  sseService.broadcast('ORDER_UPDATED', { action: 'CANCELLED', data: order }, kitchenId);
  res.json(order);
});

module.exports = { getOrders, getLiveQueue, updateOrderStatus, cancelOrder };
