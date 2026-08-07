import { motion } from "framer-motion";
import { BarChart3, TrendingUp, IndianRupee, Download } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const monthlyRevenue = [
  { month:"Mar", revenue:210000, orders:820, profit:58000 },
  { month:"Apr", revenue:245000, orders:940, profit:71000 },
  { month:"May", revenue:198000, orders:780, profit:52000 },
  { month:"Jun", revenue:280000, orders:1080,profit:84000 },
  { month:"Jul", revenue:312000, orders:1210,profit:97000 },
  { month:"Aug", revenue:190000, orders:740, profit:56000 },
];

const heatmapData = [
  { hour:"8–10", Mon:12, Tue:14, Wed:10, Thu:15, Fri:18, Sat:22, Sun:20 },
  { hour:"10–12",Mon:18, Tue:22, Wed:16, Thu:24, Fri:30, Sat:38, Sun:35 },
  { hour:"12–2", Mon:45, Tue:52, Wed:48, Thu:58, Fri:72, Sat:88, Sun:82 },
  { hour:"2–4",  Mon:32, Tue:38, Wed:30, Thu:42, Fri:55, Sat:68, Sun:60 },
  { hour:"4–6",  Mon:20, Tue:24, Wed:18, Thu:28, Fri:38, Sat:48, Sun:42 },
  { hour:"6–8",  Mon:38, Tue:44, Wed:36, Thu:50, Fri:68, Sat:82, Sun:76 },
  { hour:"8–10", Mon:42, Tue:48, Wed:40, Thu:55, Fri:74, Sat:90, Sun:84 },
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function HeatCell({ value }) {
  const max = 90;
  const intensity = value / max;
  const bg = intensity > 0.8 ? "#f97316" : intensity > 0.6 ? "#fb923c" : intensity > 0.4 ? "#fed7aa" : intensity > 0.2 ? "#1a1a2e" : "#111118";
  const text = intensity > 0.4 ? "#fff" : "#6b7280";
  return (
    <td className="p-0.5">
      <div className="w-full h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all cursor-pointer hover:opacity-80"
        style={{ background: bg, color: text }}>{value}</div>
    </td>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-xs shadow-glass">
      <p className="text-gray-400 font-semibold mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">
          {p.name}: {p.name === "revenue" || p.name === "profit" ? `₹${(p.value/1000).toFixed(0)}k` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function Reports() {
  return (
    <div className="page-content">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 size={22} className="text-brand-400"/> Business Reports
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Revenue analytics, peak hours, and performance trends</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm"><Download size={14}/> Export PDF</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:"Monthly Revenue", value:"₹3.12L", trend:"+14%", up:true,  color:"text-green-400 bg-green-500/10 border-green-500/15" },
          { label:"Total Orders",    value:"1,210",  trend:"+8%",  up:true,  color:"text-blue-400 bg-blue-500/10 border-blue-500/15" },
          { label:"Avg Order Value", value:"₹258",   trend:"+5%",  up:true,  color:"text-brand-400 bg-brand-500/10 border-brand-500/15" },
          { label:"Net Profit",      value:"₹97k",   trend:"+18%", up:true,  color:"text-purple-400 bg-purple-500/10 border-purple-500/15" },
        ].map(({label,value,trend,up,color})=>(
          <div key={label} className={`card border p-4 ${color}`}>
            <p className="text-xs font-medium opacity-70">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className={`text-xs mt-1 font-medium ${up?"text-green-400":"text-red-400"}`}>{trend} vs last month</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div className="card p-5"
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
        <h2 className="section-title mb-1">Monthly Revenue & Profit</h2>
        <p className="text-gray-500 text-xs mb-4">Last 6 months</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthlyRevenue}>
            <defs>
              <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="proG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.25}/>
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="month" tick={{ fill:"#6b7280", fontSize:12 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill:"#6b7280", fontSize:11 }} axisLine={false} tickLine={false}
              tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Legend wrapperStyle={{ fontSize:"12px", color:"#9ca3af" }}/>
            <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} fill="url(#revG)" dot={false}/>
            <Area type="monotone" dataKey="profit"  stroke="#22c55e" strokeWidth={2}   fill="url(#proG)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Peak Hour Heatmap */}
      <motion.div className="card p-5"
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">Peak Hour Heatmap</h2>
            <p className="text-gray-500 text-xs mt-0.5">Order volume by hour and day of week</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-3 h-3 rounded bg-surface-700 inline-block"/> Low
            <span className="w-3 h-3 rounded bg-brand-500 inline-block ml-2"/> High
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs text-gray-500 px-2 py-1 w-16">Time</th>
                {DAYS.map(d=>(
                  <th key={d} className="text-xs text-gray-500 text-center py-1">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row,i)=>(
                <tr key={i}>
                  <td className="text-xs text-gray-500 px-2 py-0.5 whitespace-nowrap">{row.hour}</td>
                  {DAYS.map(d=><HeatCell key={d} value={row[d]}/>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
