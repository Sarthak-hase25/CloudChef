import { useState } from "react";
import { motion } from "framer-motion";
import {
  Tag, TrendingUp, Clock, CheckCircle2,
  Info, Zap, ArrowUpRight, ArrowDownRight, BarChart2
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from "recharts";

const peakHourData = [
  { hour:"8AM",  demand:22, suggested:200, current:180 },
  { hour:"10AM", demand:18, suggested:180, current:180 },
  { hour:"12PM", demand:88, suggested:295, current:250 },
  { hour:"2PM",  demand:72, suggested:280, current:250 },
  { hour:"4PM",  demand:35, suggested:220, current:250 },
  { hour:"6PM",  demand:65, suggested:265, current:250 },
  { hour:"8PM",  demand:94, suggested:310, current:250 },
  { hour:"10PM", demand:40, suggested:230, current:250 },
];

const priceSuggestions = [
  { dish:"Butter Chicken",  current:280, suggested:310, change:"+10.7%", reason:"High peak demand 7–9 PM", up:true,  confidence:91 },
  { dish:"Chicken Biryani", current:300, suggested:330, change:"+10.0%", reason:"Weekend surge forecast",   up:true,  confidence:88 },
  { dish:"Mango Lassi",     current:90,  suggested:95,  change:"+5.6%",  reason:"Hot weather demand",       up:true,  confidence:85 },
  { dish:"Veg Soup",        current:120, suggested:100, change:"-16.7%", reason:"Low demand — use discount to clear",up:false,confidence:79},
  { dish:"Garlic Naan",     current:50,  suggested:55,  change:"+10.0%", reason:"High order rate with mains",up:true, confidence:83 },
];

const elasticityData = [
  { price:200, demand:120 }, { price:220, demand:110 }, { price:250, demand:95 },
  { price:280, demand:80 },  { price:300, demand:68 },  { price:320, demand:55 },
  { price:350, demand:40 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-xs shadow-glass">
      <p className="text-gray-400 font-semibold mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">
          {p.name === "suggested" ? "AI Price" : p.name === "current" ? "Current" : "Orders"}: {p.name.includes("Price") || p.name.includes("price") || p.name.includes("suggested") || p.name.includes("current") ? `₹${p.value}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function DynamicPricing() {
  const [applied, setApplied] = useState([]);

  const applyPrice = (dish) => {
    setApplied(prev => prev.includes(dish) ? prev : [...prev, dish]);
  };

  const totalRevGain = priceSuggestions
    .filter(p => p.up)
    .reduce((s, p) => s + (p.suggested - p.current) * 50, 0);

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/15 flex items-center justify-center">
              <Tag size={16} className="text-yellow-400"/>
            </div>
            <h1 className="text-2xl font-bold text-white">Dynamic Pricing Engine</h1>
          </div>
          <p className="text-gray-500 text-sm">Demand-elasticity based AI price recommendations</p>
        </div>
        <div className="card border border-green-500/20 bg-green-500/5 px-4 py-2.5 flex items-center gap-2">
          <TrendingUp size={14} className="text-green-400"/>
          <div>
            <p className="text-xs text-gray-400">Potential Revenue Gain</p>
            <p className="font-bold text-green-400">+₹{totalRevGain.toLocaleString()}/day</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:"Price Increases",  value:priceSuggestions.filter(p=>p.up).length,  color:"text-green-400 bg-green-500/10 border-green-500/15" },
          { label:"Price Decreases",  value:priceSuggestions.filter(p=>!p.up).length, color:"text-red-400 bg-red-500/10 border-red-500/15" },
          { label:"Applied Today",    value:applied.length,                            color:"text-brand-400 bg-brand-500/10 border-brand-500/15" },
          { label:"Avg Confidence",   value:"85.2%",                                  color:"text-blue-400 bg-blue-500/10 border-blue-500/15" },
        ].map(({label,value,color})=>(
          <div key={label} className={`card border p-4 ${color}`}>
            <p className="text-xs font-medium opacity-70">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Peak Hour Pricing */}
        <motion.div className="card p-5"
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-brand-400"/>
            <h2 className="section-title text-sm">Peak Hour Price Recommendations</h2>
          </div>
          <p className="text-gray-500 text-xs mb-4">AI vs current price (Butter Chicken)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={peakHourData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="hour" tick={{ fill:"#6b7280", fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"#6b7280", fontSize:11 }} axisLine={false} tickLine={false}
                tickFormatter={v=>`₹${v}`} domain={[160, 340]}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Line dataKey="suggested" name="suggested" stroke="#f97316" strokeWidth={2.5} dot={{ r:3, fill:"#f97316" }}/>
              <Line dataKey="current"   name="current"   stroke="#6b7280" strokeWidth={1.5} strokeDasharray="4 3" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 text-xs mt-2">
            <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-brand-500 inline-block"/><span className="text-gray-400">AI Suggested</span></span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-gray-500 inline-block"/><span className="text-gray-400">Current Fixed</span></span>
          </div>
        </motion.div>

        {/* Demand Elasticity */}
        <motion.div className="card p-5"
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={14} className="text-brand-400"/>
            <h2 className="section-title text-sm">Demand Elasticity Curve</h2>
            <div className="ml-auto group relative">
              <Info size={13} className="text-gray-600 cursor-help"/>
              <div className="absolute right-0 top-5 w-48 text-xs bg-surface-700 border border-white/10 rounded-xl p-3 text-gray-400 hidden group-hover:block z-10">
                Shows how demand changes as price increases. Used to find optimal price point.
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-xs mb-4">Price vs demand (Chicken Biryani)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={elasticityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="price" tick={{ fill:"#6b7280", fontSize:11 }} axisLine={false} tickLine={false}
                tickFormatter={v=>`₹${v}`}/>
              <YAxis tick={{ fill:"#6b7280", fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip formatter={(v,n) => n==="demand" ? [`${v} orders`,`Demand`] : [`₹${v}`,"Price"]}
                contentStyle={{ background:"rgba(17,17,24,0.95)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", color:"#fff", fontSize:"12px" }}/>
              <ReferenceLine x={300} stroke="#f97316" strokeDasharray="4 4"
                label={{ value:"Optimal ₹300", fill:"#f97316", fontSize:10, position:"insideTopLeft" }}/>
              <Line dataKey="demand" stroke="#a78bfa" strokeWidth={2.5} dot={{ r:4, fill:"#a78bfa" }}/>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Price Suggestions Table */}
      <motion.div className="card overflow-hidden"
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-brand-400"/>
            <h2 className="section-title">Price Suggestions</h2>
          </div>
          <button className="btn-primary text-xs py-1.5 px-4">Apply All Increases</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="table-head">
              <th className="table-cell">Dish</th>
              <th className="table-cell">Current</th>
              <th className="table-cell">AI Suggested</th>
              <th className="table-cell">Change</th>
              <th className="table-cell">Reason</th>
              <th className="table-cell">Confidence</th>
              <th className="table-cell">Action</th>
            </tr></thead>
            <tbody>
              {priceSuggestions.map((p,i)=>(
                <tr key={i} className="table-row">
                  <td className="table-cell font-semibold text-white">{p.dish}</td>
                  <td className="table-cell text-gray-400">₹{p.current}</td>
                  <td className="table-cell font-bold text-white">₹{p.suggested}</td>
                  <td className="table-cell">
                    <span className={`flex items-center gap-0.5 text-xs font-bold
                      ${p.up ? "text-green-400" : "text-red-400"}`}>
                      {p.up ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>}
                      {p.change}
                    </span>
                  </td>
                  <td className="table-cell text-gray-400 text-xs">{p.reason}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-14 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width:`${p.confidence}%` }}/>
                      </div>
                      <span className="text-xs text-gray-500">{p.confidence}%</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    {applied.includes(p.dish)
                      ? <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle2 size={12}/> Applied</span>
                      : <button onClick={()=>applyPrice(p.dish)} className="btn-primary text-xs py-1 px-3">Apply</button>
                    }
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
