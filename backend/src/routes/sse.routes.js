const express = require('express');
const sseService = require('../services/sse.service');

const router = express.Router();

/**
 * @route   GET /api/stream
 * @desc    Establish SSE connection for real-time updates
 * @access  Public (in a real app, this should be protected via token in query params or cookie)
 */
router.get('/', (req, res) => {
  const kitchenId = req.query.kitchenId || 'default';
  const userId = req.query.userId || 'anonymous';
  const clientId = `${kitchenId}_${userId}_${Date.now()}`;

  // Required headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*', // Adjust according to CORS policy
  });

  // Initial connection message
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', clientId })}\n\n`);

  // Register client
  sseService.addClient(clientId, res);

  req.on('close', () => {
    // Client disconnected handled in sseService
  });
});

module.exports = router;
