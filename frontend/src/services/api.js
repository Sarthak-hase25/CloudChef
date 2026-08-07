import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const AI_BASE  = import.meta.env.VITE_AI_URL  || "http://localhost:8000/api";

// ─── Main API instance ────────────────────────────────────────────────────────
export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ─── AI Service instance ──────────────────────────────────────────────────────
export const aiApi = axios.create({ baseURL: AI_BASE });

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authService = {
  login:        (data) => api.post("/auth/login", data),
  register:     (data) => api.post("/auth/register", data),
  me:           ()     => api.get("/auth/me"),
  logout:       ()     => api.post("/auth/logout"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword:  (data)  => api.post("/auth/reset-password", data),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardService = {
  getStats:    () => api.get("/dashboard/stats"),
  getRevenue:  () => api.get("/dashboard/revenue"),
  getOrders:   () => api.get("/dashboard/orders-trend"),
  getTopDishes: () => api.get("/dashboard/top-dishes"),
  getAlerts:   () => api.get("/dashboard/alerts"),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orderService = {
  getAll:       (params) => api.get("/orders", { params }),
  getById:      (id)     => api.get(`/orders/${id}`),
  create:       (data)   => api.post("/orders", data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  cancel:       (id)     => api.patch(`/orders/${id}/cancel`),
  getLiveQueue: ()       => api.get("/orders/live-queue"),
};

// ─── Menu ─────────────────────────────────────────────────────────────────────
export const menuService = {
  getAll:       (params) => api.get("/menu", { params }),
  getById:      (id)     => api.get(`/menu/${id}`),
  create:       (data)   => api.post("/menu", data),
  update:       (id, data) => api.put(`/menu/${id}`, data),
  delete:       (id)     => api.delete(`/menu/${id}`),
  restore:      (id)     => api.post(`/menu/${id}/restore`),
  toggleAvail:  (id)     => api.patch(`/menu/${id}/availability`),
  getCategories: ()      => api.get("/menu/categories"),
};

// ─── Inventory ────────────────────────────────────────────────────────────────
export const inventoryService = {
  getAll:       (params) => api.get("/inventory", { params }),
  getById:      (id)     => api.get(`/inventory/${id}`),
  create:       (data)   => api.post("/inventory", data),
  update:       (id, data) => api.put(`/inventory/${id}`, data),
  delete:       (id)     => api.delete(`/inventory/${id}`),
  restore:      (id)     => api.post(`/inventory/${id}/restore`),
  addStock:     (id, data) => api.post(`/inventory/${id}/stock`, data),
  getLowStock:  ()       => api.get("/inventory/low-stock"),
  getExpiring:  ()       => api.get("/inventory/expiring"),
  logWaste:     (data)   => api.post("/inventory/waste-log", data),
};

// ─── Customers ────────────────────────────────────────────────────────────────
export const customerService = {
  getAll:     (params) => api.get("/customers", { params }),
  getById:    (id)     => api.get(`/customers/${id}`),
  create:     (data)   => api.post("/customers", data),
  update:     (id, data) => api.put(`/customers/${id}`, data),
  delete:     (id)     => api.delete(`/customers/${id}`),
  getOrders:  (id)     => api.get(`/customers/${id}/orders`),
};

// ─── Suppliers ────────────────────────────────────────────────────────────────
export const supplierService = {
  getAll:    (params) => api.get("/suppliers", { params }),
  getById:   (id)     => api.get(`/suppliers/${id}`),
  create:    (data)   => api.post("/suppliers", data),
  update:    (id, data) => api.put(`/suppliers/${id}`, data),
  delete:    (id)     => api.delete(`/suppliers/${id}`),
  createPO:  (data)   => api.post("/suppliers/purchase-orders", data),
  getPOs:    (params) => api.get("/suppliers/purchase-orders", { params }),
};

// ─── AI Services ──────────────────────────────────────────────────────────────
export const aiService = {
  // Demand Forecasting
  forecastDemand:   (params) => aiApi.post("/forecast/demand", params),
  compareModels:    (params) => aiApi.post("/models/compare", params),

  // Inventory AI
  forecastInventory: (params) => aiApi.post("/forecast/inventory", params),

  // Waste Prediction
  predictWaste:     (params) => aiApi.post("/forecast/waste", params),

  // Dynamic Pricing
  getPricingSuggestions: (params) => aiApi.post("/pricing/suggest", params),

  // Recommendations
  getRecommendations: (customerId) => aiApi.get(`/recommend/dishes/${customerId}`),

  // Analytics
  getPeakHours:    () => aiApi.get("/analytics/peak-hours"),
  getRevenueForec: () => aiApi.get("/analytics/revenue"),

  // Explainability
  explainForecast: (params) => aiApi.post("/explain/forecast", params),
};
