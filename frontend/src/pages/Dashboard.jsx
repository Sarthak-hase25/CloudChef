import { motion } from "framer-motion";
import {
  TrendingUp, ShoppingBag, Users, AlertTriangle,
  ArrowUpRight, ArrowDownRight, IndianRupee, Clock,
  Flame, Package, ChefHat, Star
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const revenueData = [
  { day: "Mon", revenue: 18400, orders: 62 },
  { day: "Tue", revenue: 22100, orders: 74 },
  { day: "Wed", revenue: 19800, orders: 66 },
  { day: "Thu", revenue: 26500, orders: 88 },
  { day: "Fri", revenue: 31200, orders: 104 },
  { day: "Sat", revenue: 38900, orders: 130 },
  { day: "Sun", revenue: 34700, orders: 116 },
];

const orderStatusData = [
  { name: "Delivered",  value: 68, color: "#22c55e" },
  { name: "Preparing",  value: 14, color: "#f97316" },
  { name: "Pending",    value: 10, color: "#eab308" },
  { name: "Cancelled",  value: 8,  color: "#ef4444" },
];

const topDishes = [
  { name: "Butter Chicken",    orders: 142, revenue: 35500, trend: "+12%", up: true  },
  { name: "Paneer Tikka",      orders: 118, revenue: 26550, trend: "+8%",  up: true  },
  { name: "Biryani (Chicken)", orders: 104, revenue: 31200, trend: "+19%", up: true  },
  { name: "Dal Makhani",       orders:  89, revenue: 17800, trend: "-3%",  up: false },
  { name: "Veg Thali",         orders:  76, revenue: 15200, trend: "+5%",  up: true  },
];

const recentOrders = [
  { id: "ORD-1042", customer: "Ankit Shah",   items: 3, amount: 860,  status: "Preparing", time: "2 min ago" },
  { id: "ORD-1041", customer: "Priya Nair",   items: 2, amount: 540,  status: "Ready",     time: "8 min ago" },
  { id: "ORD-1040", customer: "Rahul Verma",  items: 5, amount: 1340, status: "Delivered", time: "14 min ago"},
  { id: "ORD-1039", customer: "Sneha Patil",  items: 1, amount: 280,  status: "Pending",   time: "19 min ago"},
  { id: "ORD-1038", customer: "Kiran Mehta",  items: 4, amount: 980,  status: "Delivered", time: "25 min ago"},
];

const lowStockItems = [
  { name: "Tomatoes",       stock: "2 kg",   needed: "8 kg",  urgent: true  },
  { name: "Chicken Breast", stock: "1.5 kg", needed: "5 kg",  urgent: true  },
  { name: "Basmati Rice",   stock: "4 kg",   needed: "10 kg", urgent: false },
];

const aiInsights = [
  { icon: TrendingUp, color: "text-green-400 bg-green-500/10", text: "Demand forecast predicts +22% orders this Saturday. Prepare extra stock." },
  { icon: AlertTriangle, color: "text-yellow-400 bg-yellow-500/10", text: "Tomatoes & Chicken may run out in ~3 hours at current consumption rate." },
  { icon: Star, color: "text-brand-400 bg-brand-500/10", text: "Dynamic pricing suggests increasing Biryani price by ₹20 during 7–9 PM peak." },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const statusColors = {
  Pending:   "badge-warning",
  Preparing: "badge-brand",
  Ready:     "badge-info",
  Delivered: "badge-success",
  Cancelled: "badge-danger",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-sm shadow-glass">
      <p className="text-gray-400 mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name === "revenue" ? `₹${p.value.toLocaleString()}` : `${p.value} orders`}
        </p>
      ))}
    </div>
  );
};

function StatCard({ title, value, sub, icon: Icon, iconColor, trend, up, delay }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-green-400" : "text-red-400"}`}>
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-gray-400 text-sm">{title}</p>
        {sub && <p className="text-gray-600 text-xs mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Good Morning, Sarthak 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
          Kitchen is Open
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Revenue"   value="₹34,700"
          sub="Monthly: ₹8.2L"     icon={IndianRupee}
          iconColor="text-green-400 bg-green-500/10"
          trend="+14%" up delay={0}
        />
        <StatCard
          title="Total Orders Today" value="116"
          sub="62 completed"        icon={ShoppingBag}
          iconColor="text-brand-400 bg-brand-500/10"
          trend="+8%" up delay={0.05}
        />
        <StatCard
          title="Active Customers"   value="1,284"
          sub="38 new this week"    icon={Users}
          iconColor="text-blue-400 bg-blue-500/10"
          trend="+5%" up delay={0.1}
        />
        <StatCard
          title="Low Stock Alerts"   value="3 items"
          sub="Needs reorder soon"  icon={AlertTriangle}
          iconColor="text-yellow-400 bg-yellow-500/10"
          trend="Urgent" up={false} delay={0.15}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          className="card p-5 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Weekly Revenue</h2>
              <p className="text-gray-500 text-xs mt-0.5">Last 7 days performance</p>
            </div>
            <span className="badge badge-success text-xs">+14% vs last week</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="revenue"
                stroke="#f97316" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
              <Area type="monotone" dataKey="orders" name="orders"
                stroke="#60a5fa" strokeWidth={2} fill="url(#ordGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status Pie */}
        <motion.div
          className="card p-5"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <h2 className="section-title mb-1">Order Status</h2>
          <p className="text-gray-500 text-xs mb-4">Today's distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={orderStatusData} innerRadius={50} outerRadius={75}
                paddingAngle={3} dataKey="value">
                {orderStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{
                background: "rgba(17,17,24,0.95)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px", color: "#fff", fontSize: "12px"
              }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {orderStatusData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-gray-400">{d.name}</span>
                </div>
                <span className="font-semibold text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Orders */}
        <motion.div
          className="card lg:col-span-2 overflow-hidden"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="section-title">Recent Orders</h2>
            <button className="text-brand-400 text-xs font-medium hover:text-brand-300 transition-colors">View All</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="table-head">
                <th className="table-cell">Order</th>
                <th className="table-cell">Customer</th>
                <th className="table-cell hidden md:table-cell">Items</th>
                <th className="table-cell">Amount</th>
                <th className="table-cell">Status</th>
                <th className="table-cell hidden md:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="table-row">
                  <td className="table-cell font-mono text-xs text-gray-400">{o.id}</td>
                  <td className="table-cell font-medium text-white">{o.customer}</td>
                  <td className="table-cell hidden md:table-cell text-gray-400">{o.items}</td>
                  <td className="table-cell font-semibold text-white">₹{o.amount}</td>
                  <td className="table-cell">
                    <span className={statusColors[o.status]}>{o.status}</span>
                  </td>
                  <td className="table-cell hidden md:table-cell text-gray-500 text-xs">{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Right column */}
        <div className="space-y-4">

          {/* AI Insights */}
          <motion.div
            className="card p-5"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Flame size={15} className="text-brand-400" />
              <h2 className="section-title text-sm">AI Insights</h2>
            </div>
            <div className="space-y-2.5">
              {aiInsights.map(({ icon: Icon, color, text }, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon size={13} />
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Low Stock */}
          <motion.div
            className="card p-5"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Package size={15} className="text-yellow-400" />
              <h2 className="section-title text-sm">Low Stock Alerts</h2>
            </div>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.name} className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs
                  ${item.urgent ? "bg-red-500/8 border border-red-500/15" : "bg-yellow-500/5 border border-yellow-500/10"}`}>
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-gray-500">Stock: {item.stock}</p>
                  </div>
                  <div className="text-right">
                    {item.urgent && <span className="badge badge-danger text-[10px]">Urgent</span>}
                    <p className="text-gray-500 mt-0.5">Need {item.needed}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Top Dishes */}
      <motion.div
        className="card overflow-hidden"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <ChefHat size={16} className="text-brand-400" />
            <h2 className="section-title">Top Performing Dishes</h2>
          </div>
          <span className="text-gray-500 text-xs">This week</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-head">
                <th className="table-cell">#</th>
                <th className="table-cell">Dish Name</th>
                <th className="table-cell">Orders</th>
                <th className="table-cell">Revenue</th>
                <th className="table-cell">Trend</th>
                <th className="table-cell">Demand Bar</th>
              </tr>
            </thead>
            <tbody>
              {topDishes.map((dish, i) => (
                <tr key={dish.name} className="table-row">
                  <td className="table-cell text-gray-600 font-bold">{i + 1}</td>
                  <td className="table-cell font-semibold text-white">{dish.name}</td>
                  <td className="table-cell text-gray-300">{dish.orders}</td>
                  <td className="table-cell font-semibold text-white">₹{dish.revenue.toLocaleString()}</td>
                  <td className="table-cell">
                    <span className={`flex items-center gap-0.5 text-xs font-semibold
                      ${dish.up ? "text-green-400" : "text-red-400"}`}>
                      {dish.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      {dish.trend}
                    </span>
                  </td>
                  <td className="table-cell w-40">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-brand rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(dish.orders / 142) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                      />
                    </div>
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
