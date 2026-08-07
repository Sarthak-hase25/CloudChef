import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Users, TrendingUp, ShoppingBag, Heart, RefreshCw, Brain } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

const CUSTOMERS = [
  { id:1, name:"Ankit Shah",  avatar:"A", segment:"Loyal",    orders:42, spent:11800, lastOrder:"2h ago",   favs:["Butter Chicken","Biryani"] },
  { id:2, name:"Priya Nair",  avatar:"P", segment:"Regular",  orders:18, spent:4900,  lastOrder:"1d ago",   favs:["Paneer Tikka","Mango Lassi"] },
  { id:3, name:"Rahul Verma", avatar:"R", segment:"At Risk",  orders:6,  spent:1640,  lastOrder:"12d ago",  favs:["Veg Thali"] },
  { id:4, name:"Sneha Patil", avatar:"S", segment:"New",      orders:2,  spent:560,   lastOrder:"3d ago",   favs:["Dal Fry","Garlic Naan"] },
];

const DISH_RECS = [
  { rank:1, dish:"Chicken Tikka Masala", score:0.94, reason:"Based on Butter Chicken preference", tag:"Top Pick"   },
  { rank:2, dish:"Mutton Biryani",       score:0.88, reason:"Ordered Chicken Biryani 8 times",    tag:"Try This"   },
  { rank:3, dish:"Shahi Paneer",         score:0.81, reason:"Similar users also ordered this",    tag:"Popular"    },
  { rank:4, dish:"Kesar Lassi",          score:0.76, reason:"Pairs well with your orders",        tag:"Combo"      },
  { rank:5, dish:"Gulab Jamun",          score:0.71, reason:"Most ordered dessert by loyal users",tag:"Upsell"     },
];

const PROFILE_RADAR = [
  { subject:"Frequency",   value:90 },
  { subject:"Spend",       value:85 },
  { subject:"Variety",     value:60 },
  { subject:"Rating",      value:95 },
  { subject:"Loyalty",     value:88 },
  { subject:"Recency",     value:92 },
];

const segColors = {
  Loyal:   "badge-success",
  Regular: "badge-info",
  "At Risk":"badge-warning",
  New:     "badge-brand",
};

export default function Recommendations() {
  const [selected, setSelected] = useState(CUSTOMERS[0]);

  return (
    <div className="page-content">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <Star size={16} className="text-purple-400"/>
          </div>
          <h1 className="text-2xl font-bold text-white">Recommendation System</h1>
        </div>
        <p className="text-gray-500 text-sm">Hybrid collaborative + content-based filtering engine</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:"Total Customers",    value:"1,284", color:"text-blue-400 bg-blue-500/10 border-blue-500/15" },
          { label:"Loyal Segment",      value:"312",   color:"text-green-400 bg-green-500/10 border-green-500/15" },
          { label:"At Risk",            value:"87",    color:"text-yellow-400 bg-yellow-500/10 border-yellow-500/15" },
          { label:"Avg Rec. Score",     value:"0.83",  color:"text-purple-400 bg-purple-500/10 border-purple-500/15" },
        ].map(({label,value,color})=>(
          <div key={label} className={`card border p-4 ${color}`}>
            <p className="text-xs font-medium opacity-70">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Customer List */}
        <div className="card p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-brand-400"/>
            <h2 className="section-title text-sm">Select Customer</h2>
          </div>
          {CUSTOMERS.map(c=>(
            <button key={c.id} onClick={()=>setSelected(c)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200
                ${selected.id===c.id?"bg-brand-500/15 border border-brand-500/20":"hover:bg-white/5 border border-transparent"}`}>
              <div className="w-9 h-9 rounded-xl bg-brand-500/30 flex items-center justify-center text-brand-400 font-bold flex-shrink-0">
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{c.name}</p>
                <p className="text-xs text-gray-500">{c.orders} orders · {c.lastOrder}</p>
              </div>
              <span className={`text-xs ${segColors[c.segment]}`}>{c.segment}</span>
            </button>
          ))}
        </div>

        {/* Customer Profile */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-lg">
              {selected.avatar}
            </div>
            <div>
              <p className="font-bold text-white">{selected.name}</p>
              <span className={`text-xs ${segColors[selected.segment]}`}>{selected.segment} Customer</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label:"Total Orders", value:selected.orders, icon:ShoppingBag },
              { label:"Total Spent",  value:`₹${selected.spent.toLocaleString()}`, icon:TrendingUp },
            ].map(({label,value,icon:Icon})=>(
              <div key={label} className="card p-3">
                <Icon size={13} className="text-gray-500 mb-1"/>
                <p className="font-bold text-white">{value}</p>
                <p className="text-gray-500 text-xs">{label}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
              <Heart size={10}/> Favourites
            </p>
            <div className="flex flex-wrap gap-2">
              {selected.favs.map(f=>(
                <span key={f} className="badge badge-brand text-xs">{f}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Customer Profile</p>
            <ResponsiveContainer width="100%" height={160}>
              <RadarChart data={PROFILE_RADAR}>
                <PolarGrid stroke="rgba(255,255,255,0.06)"/>
                <PolarAngleAxis dataKey="subject" tick={{ fill:"#6b7280", fontSize:10 }}/>
                <Radar dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.15} strokeWidth={1.5}/>
                <Tooltip contentStyle={{ background:"rgba(17,17,24,0.95)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", color:"#fff", fontSize:"11px" }}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Brain size={14} className="text-purple-400"/>
            <h2 className="section-title text-sm">AI Dish Recommendations</h2>
            <button className="ml-auto btn-ghost p-1.5 rounded-lg"><RefreshCw size={13}/></button>
          </div>
          <p className="text-xs text-gray-500">For {selected.name} — hybrid collaborative + content-based</p>
          <div className="space-y-2.5">
            {DISH_RECS.map((r,i)=>(
              <motion.div key={r.dish} initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }}
                transition={{ delay: i*0.07 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors cursor-pointer">
                <span className="text-gray-600 font-bold text-sm w-4 flex-shrink-0">#{r.rank}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{r.dish}</p>
                  <p className="text-gray-500 text-xs truncate">{r.reason}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-brand-400 text-sm">{(r.score*100).toFixed(0)}%</p>
                  <span className="badge badge-brand text-[10px]">{r.tag}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="btn-primary w-full text-sm py-2">Send Personalized Menu</button>
        </div>
      </div>
    </div>
  );
}
