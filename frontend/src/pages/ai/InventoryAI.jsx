import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Package, TrendingDown, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const inventoryForecastData = [
  { day: "Mon", tomatoes: 42, chicken: 35, rice: 28 },
  { day: "Tue", tomatoes: 45, chicken: 38, rice: 30 },
  { day: "Wed", tomatoes: 40, chicken: 32, rice: 25 },
  { day: "Thu", tomatoes: 55, chicken: 48, rice: 40 },
  { day: "Fri", tomatoes: 75, chicken: 65, rice: 55 },
  { day: "Sat", tomatoes: 85, chicken: 78, rice: 65 },
  { day: "Sun", tomatoes: 80, chicken: 72, rice: 60 },
];

const reorderSuggestions = [
  { item: "Tomatoes",       current: "12 kg", predictedNeed: "45 kg", suggest: "35 kg", urgency: "High",   confidence: "92%" },
  { item: "Chicken Breast", current: "8 kg",  predictedNeed: "38 kg", suggest: "35 kg", urgency: "High",   confidence: "88%" },
  { item: "Basmati Rice",   current: "45 kg", predictedNeed: "30 kg", suggest: "0 kg",  urgency: "Low",    confidence: "95%" },
  { item: "Paneer",         current: "5 kg",  predictedNeed: "22 kg", suggest: "20 kg", urgency: "Medium", confidence: "84%" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-xs shadow-glass space-y-1">
      <p className="text-gray-400 font-semibold mb-1">{label} Forecast</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span style={{ color: p.color }} className="capitalize">{p.dataKey}</span>
          <span className="font-bold text-white">{p.value} kg</span>
        </div>
      ))}
    </div>
  );
};

export default function InventoryAI() {
  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Brain size={16} className="text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Inventory Optimization</h1>
          </div>
          <p className="text-gray-500 text-sm">Predictive stock depletion and automated reordering</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <RefreshCw size={14} /> Update Forecast
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Stockout Risk",      value: "Low",     icon: TrendingDown, color: "text-green-400 bg-green-500/10 border-green-500/15" },
          { label: "Suggested Reorders", value: "3 Items", icon: Package,      color: "text-brand-400 bg-brand-500/10 border-brand-500/15" },
          { label: "Forecast Accuracy",  value: "91.2%",   icon: Brain,        color: "text-blue-400 bg-blue-500/10 border-blue-500/15" },
          { label: "Capital Optimized",  value: "₹4,200",  icon: ArrowUpRight, color: "text-purple-400 bg-purple-500/10 border-purple-500/15" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`card border p-4 ${color} flex flex-col justify-between`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} /> <span className="text-xs font-medium opacity-70">{label}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Depletion Chart */}
      <motion.div className="card p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="section-title mb-1">Predicted Ingredient Depletion</h2>
        <p className="text-gray-500 text-xs mb-4">7-day forecast for high-velocity items</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={inventoryForecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="tomatoes" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
            <Area type="monotone" dataKey="chicken"  stroke="#f97316" fill="#f97316" fillOpacity={0.1} strokeWidth={2} />
            <Area type="monotone" dataKey="rice"     stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Reorder Table */}
      <motion.div className="card overflow-hidden" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="section-title">Automated Reorder Suggestions</h2>
          <button className="text-brand-400 text-xs font-medium hover:text-brand-300">Approve All Auto-Orders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-head">
                <th className="table-cell">Ingredient</th>
                <th className="table-cell">Current Stock</th>
                <th className="table-cell">Predicted Need (7d)</th>
                <th className="table-cell">AI Suggested Order</th>
                <th className="table-cell">Urgency</th>
                <th className="table-cell">Confidence</th>
                <th className="table-cell">Action</th>
              </tr>
            </thead>
            <tbody>
              {reorderSuggestions.map((item, i) => (
                <tr key={i} className="table-row">
                  <td className="table-cell font-semibold text-white">{item.item}</td>
                  <td className="table-cell text-gray-400">{item.current}</td>
                  <td className="table-cell text-gray-400">{item.predictedNeed}</td>
                  <td className="table-cell font-bold text-white">{item.suggest}</td>
                  <td className="table-cell">
                    <span className={`badge ${item.urgency === "High" ? "badge-danger" : item.urgency === "Medium" ? "badge-warning" : "badge-success"}`}>
                      {item.urgency}
                    </span>
                  </td>
                  <td className="table-cell text-gray-400 text-xs">{item.confidence}</td>
                  <td className="table-cell">
                    <button className="btn-primary text-xs py-1 px-3" disabled={item.suggest === "0 kg"}>
                      Create PO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
