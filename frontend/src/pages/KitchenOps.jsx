import { motion } from "framer-motion";
import { ChefHat, Flame, Thermometer, Droplets, CheckCircle2 } from "lucide-react";

export default function KitchenOps() {
  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ChefHat size={22} className="text-brand-400"/> Kitchen Operations
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Station management and real-time prep metrics</p>
        </div>
      </div>

      {/* Stations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "Grill Station", load: 85, active: 4,  color: "text-red-400" },
          { name: "Curry Station", load: 60, active: 3,  color: "text-brand-400" },
          { name: "Prep & Salad",  load: 25, active: 1,  color: "text-green-400" },
          { name: "Dessert & Bev", load: 40, active: 2,  color: "text-blue-400" },
        ].map((s,i)=>(
          <motion.div key={s.name} className="card p-4" initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{delay:i*0.1}}>
            <h3 className="font-bold text-white mb-3">{s.name}</h3>
            <div className="flex items-end justify-between mb-1">
              <span className="text-xs text-gray-500">Current Load</span>
              <span className={`font-bold ${s.color}`}>{s.load}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-current rounded-full" style={{ width:`${s.load}%`, color: s.color.replace("text-", "") }}/>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Flame size={14}/> {s.active} Active Orders
            </div>
          </motion.div>
        ))}
      </div>

      {/* Environment */}
      <motion.div className="card p-5 mt-4" initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{delay:0.4}}>
        <h2 className="section-title mb-4">Environment Sensors (IoT)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
            <Thermometer size={24} className="text-red-400"/>
            <div>
              <p className="text-gray-500 text-xs">Cold Storage Temp</p>
              <p className="font-bold text-white text-xl">3.2°C <span className="text-green-400 text-sm font-normal ml-2">Optimal</span></p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
            <Thermometer size={24} className="text-blue-400"/>
            <div>
              <p className="text-gray-500 text-xs">Freezer Temp</p>
              <p className="font-bold text-white text-xl">-18.5°C <span className="text-green-400 text-sm font-normal ml-2">Optimal</span></p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
            <Droplets size={24} className="text-blue-300"/>
            <div>
              <p className="text-gray-500 text-xs">Kitchen Humidity</p>
              <p className="font-bold text-white text-xl">45% <span className="text-green-400 text-sm font-normal ml-2">Optimal</span></p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
