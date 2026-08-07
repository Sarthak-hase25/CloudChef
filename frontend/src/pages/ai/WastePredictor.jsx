import { motion } from "framer-motion";
import { Trash2, TrendingDown, AlertCircle, IndianRupee, Brain, CheckCircle2 } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const wasteTrend = [
  { day:"Mon", predicted:4.2, actual:3.8 },
  { day:"Tue", predicted:5.1, actual:5.6 },
  { day:"Wed", predicted:3.9, actual:3.5 },
  { day:"Thu", predicted:6.2, actual:5.9 },
  { day:"Fri", predicted:4.8, actual:null },
  { day:"Sat", predicted:7.1, actual:null },
  { day:"Sun", predicted:6.4, actual:null },
];

const itemWaste = [
  { name:"Tomatoes",   waste:1.5, cost:60,  color:"#ef4444" },
  { name:"Dal",        waste:0.8, cost:48,  color:"#f97316" },
  { name:"Coriander",  waste:0.3, cost:15,  color:"#eab308" },
  { name:"Roti dough", waste:0.6, cost:27,  color:"#f97316" },
  { name:"Salad",      waste:0.4, cost:20,  color:"#eab308" },
];

const recommendations = [
  { dish:"Dal Fry",        currentQty:"5 kg", suggested:"3.5 kg", saving:"₹90", confidence:"87%" },
  { dish:"Veg Soup",       currentQty:"8 L",  suggested:"5 L",    saving:"₹120",confidence:"82%" },
  { dish:"Paneer Bhurji",  currentQty:"3 kg", suggested:"2 kg",   saving:"₹380",confidence:"79%" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-xs shadow-glass">
      <p className="text-gray-400 font-semibold mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">
          {p.name === "predicted" ? "Predicted" : "Actual"}: {p.value} kg
        </p>
      ))}
    </div>
  );
};

export default function WastePredictor() {
  const totalWaste = itemWaste.reduce((s, i) => s + i.cost, 0);

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center">
              <Trash2 size={16} className="text-red-400"/>
            </div>
            <h1 className="text-2xl font-bold text-white">Food Waste Predictor</h1>
          </div>
          <p className="text-gray-500 text-sm">AI-predicted waste with financial loss estimation</p>
        </div>
        <div className="card border border-red-500/20 bg-red-500/5 px-4 py-2.5 flex items-center gap-2">
          <IndianRupee size={14} className="text-red-400"/>
          <div>
            <p className="text-xs text-gray-400">Today's Waste Cost</p>
            <p className="font-bold text-red-400">₹{totalWaste} estimated</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:"Predicted Waste Today", value:"6.2 kg",  sub:"↑ vs avg 4.8 kg", color:"text-red-400 bg-red-500/10 border-red-500/15" },
          { label:"Financial Loss Est.",   value:"₹170",    sub:"Today",            color:"text-orange-400 bg-orange-500/10 border-orange-500/15" },
          { label:"Waste Reduced (AI)",    value:"32%",     sub:"vs last month",    color:"text-green-400 bg-green-500/10 border-green-500/15" },
          { label:"Model Accuracy",        value:"87.4%",   sub:"MAE: 0.38 kg",    color:"text-brand-400 bg-brand-500/10 border-brand-500/15" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className={`card border p-4 ${color}`}>
            <p className="text-xs font-medium opacity-70">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs opacity-60 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Waste trend */}
        <motion.div className="card p-5"
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
          <h2 className="section-title mb-1">Predicted vs Actual Waste</h2>
          <p className="text-gray-500 text-xs mb-4">Weekly trend (kg) — dashed = forecast</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={wasteTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="day" tick={{ fill:"#6b7280", fontSize:12 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"#6b7280", fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Line dataKey="actual"    stroke="#ef4444" strokeWidth={2.5} dot={{ r:4, fill:"#ef4444" }} connectNulls={false}/>
              <Line dataKey="predicted" stroke="#f97316" strokeWidth={1.5} strokeDasharray="5 3" dot={false} connectNulls/>
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 text-xs mt-2">
            <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-red-500 inline-block"/><span className="text-gray-400">Actual</span></span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-brand-500 inline-block"/><span className="text-gray-400">Predicted</span></span>
          </div>
        </motion.div>

        {/* Per-item waste */}
        <motion.div className="card p-5"
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
          <h2 className="section-title mb-1">Waste by Ingredient</h2>
          <p className="text-gray-500 text-xs mb-4">Today's breakdown (kg)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={itemWaste} layout="vertical" margin={{ left:16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false}/>
              <XAxis type="number" tick={{ fill:"#6b7280", fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" tick={{ fill:"#9ca3af", fontSize:11 }} axisLine={false} tickLine={false} width={80}/>
              <Tooltip formatter={(v) => [`${v} kg`, "Waste"]}
                contentStyle={{ background:"rgba(17,17,24,0.95)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", color:"#fff", fontSize:"12px" }}/>
              <Bar dataKey="waste" radius={[0,6,6,0]}>
                {itemWaste.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* AI Recommendations */}
      <motion.div className="card p-5"
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <div className="flex items-center gap-2 mb-4">
          <Brain size={15} className="text-brand-400"/>
          <h2 className="section-title">AI Preparation Recommendations</h2>
          <span className="ml-auto text-xs text-gray-500">Reduce waste by preparing optimal quantities</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="table-head">
              <th className="table-cell">Dish</th>
              <th className="table-cell">Current Prep Qty</th>
              <th className="table-cell">AI Suggested Qty</th>
              <th className="table-cell">Estimated Saving</th>
              <th className="table-cell">Confidence</th>
              <th className="table-cell">Action</th>
            </tr></thead>
            <tbody>
              {recommendations.map((r,i)=>(
                <tr key={i} className="table-row">
                  <td className="table-cell font-semibold text-white">{r.dish}</td>
                  <td className="table-cell text-gray-400">{r.currentQty}</td>
                  <td className="table-cell"><span className="text-green-400 font-medium">{r.suggested}</span></td>
                  <td className="table-cell"><span className="text-green-400 font-bold">{r.saving}</span></td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width:r.confidence }}/>
                      </div>
                      <span className="text-xs text-gray-400">{r.confidence}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <button className="btn-primary text-xs py-1 px-3 flex items-center gap-1">
                      <CheckCircle2 size={11}/> Apply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Insight box */}
      <div className="card border border-green-500/20 bg-green-500/5 p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-green-400 flex-shrink-0 mt-0.5"/>
        <p className="text-sm text-gray-300">
          By following AI preparation recommendations this week, you can <span className="text-green-400 font-bold">save ₹590</span> in food waste.
          That's a <span className="text-green-400 font-bold">32% reduction</span> compared to last month's average.
        </p>
      </div>
    </div>
  );
}
