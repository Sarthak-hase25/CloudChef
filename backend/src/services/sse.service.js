/**
 * Server-Sent Events (SSE) Service
 * Manages real-time connections with clients for live updates.
 */

class SSEService {
  constructor() {
    this.clients = new Map(); // Map of clientId -> res object
  }

  /**
   * Adds a new client connection
   * @param {string} clientId 
   * @param {object} res - Express response object
   */
  addClient(clientId, res) {
    this.clients.set(clientId, res);

    res.on('close', () => {
      this.clients.delete(clientId);
    });
  }

  /**
   * Broadcasts an event to all connected clients (or specific kitchenId if provided)
   * @param {string} type - Event type (e.g., 'INVENTORY_UPDATED', 'ORDER_CREATED')
   * @param {object} payload - Data to send
   * @param {string} [kitchenId] - Optional: If provided, only send to clients in this kitchen
   */
  broadcast(type, payload, kitchenId = null) {
    const data = JSON.stringify({ type, payload, timestamp: new Date().toISOString() });
    
    for (const [clientId, res] of this.clients.entries()) {
      // In a multi-tenant app, the clientId usually contains the kitchenId
      // e.g., `${kitchenId}_${userId}_${Date.now()}`
      if (!kitchenId || clientId.startsWith(`${kitchenId}_`)) {
        try {
          res.write(`data: ${data}\n\n`);
        } catch (error) {
          console.error(`Failed to send event to client ${clientId}:`, error);
          this.clients.delete(clientId);
        }
      }
    }
  }

  /**
   * Sends a heartbeat to keep connections alive
   */
  sendHeartbeat() {
    for (const [clientId, res] of this.clients.entries()) {
      try {
        res.write(`:\n\n`); // SSE comment acts as ping
      } catch (error) {
        this.clients.delete(clientId);
      }
    }
  }
}

const sseService = new SSEService();

// Heartbeat every 30 seconds to prevent connection drops by proxies/load balancers
setInterval(() => {
  sseService.sendHeartbeat();
}, 30000);

module.exports = sseService;
