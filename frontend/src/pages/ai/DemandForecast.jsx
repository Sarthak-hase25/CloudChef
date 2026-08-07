import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Brain, BarChart2, Info,
  RefreshCw, CheckCircle2, Award, Zap
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from "recharts";

// ─── Mock Forecast Data ───────────────────────────────────────────────────────
const forecastData = [
  { date:"Mon", actual:88,  rf:85,  xgb:87, lgbm:84, lstm:89, prophet:91  },
  { date:"Tue", actual:74,  rf:77,  xgb:75, lgbm:78, lstm:73, prophet:72  },
  { date:"Wed", actual:102, rf:98,  xgb:101,lgbm:99, lstm:104,prophet:100 },
  { date:"Thu", actual:96,  rf:94,  xgb:97, lgbm:95, lstm:98, prophet:93  },
  { date:"Fri", actual:130, rf:125, xgb:128,lgbm:126,lstm:132,prophet:129 },
  { date:"Sat", actual:null,rf:148, xgb:152,lgbm:146,lstm:155,prophet:150 },
  { date:"Sun", actual:null,rf:141, xgb:144,lgbm:139,lstm:148,prophet:143 },
];

const modelMetrics = [
  { model:"Random Forest",  mae:4.2, rmse:5.8, mape:"4.8%", r2:"0.94", color:"#60a5fa", winner:false },
  { model:"XGBoost",        mae:3.1, rmse:4.2, mape:"3.5%", r2:"0.97", color:"#f97316", winner:true  },
  { model:"LightGBM",       mae:3.8, rmse:5.1, mape:"4.1%", r2:"0.95", color:"#a78bfa", winner:false },
  { model:"LSTM",           mae:3.4, rmse:4.6, mape:"3.9%", r2:"0.96", color:"#34d399", winner:false },
  { model:"Prophet",        mae:4.8, rmse:6.2, mape:"5.2%", r2:"0.93", color:"#fb923c", winner:false },
];

const weeklyForecast = [
  { period:"This Week",    predicted:782, confidence:"94%", change:"+12%", up:true  },
  { period:"Next Weekend", predicted:298, confidence:"88%", change:"+22%", up:true  },
  { period:"Eid Festival", predicted:410, confidence:"82%", change:"+45%", up:true  },
  { period:"Rainy Day",    predicted:94,  confidence:"79%", change:"-28%", up:false },
];

const featureImportance = [
  { feature:"Day of Week",    importance:0.28 },
  { feature:"Hour of Day",    importance:0.22 },
  { feature:"Is Weekend",     importance:0.18 },
  { feature:"Festival Flag",  importance:0.13 },
  { feature:"Weather",        importance:0.09 },
  { feature:"Prev Week Avg",  importance:0.10 },
];

const MODELS = ["rf","xgb","lgbm","lstm","prophet"];
const MODEL_LABELS = { rf:"Random Forest", xgb:"XGBoost", lgbm:"LightGBM", lstm:"LSTM", prophet:"Prophet" };
const MODEL_COLORS = { rf:"#60a5fa", xgb:"#f97316", lgbm:"#a78bfa", lstm:"#34d399", prophet:"#fb923c" };

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-xs shadow-glass space-y-1">
      <p className="text-gray-400 font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span style={{ color: p.color }}>{MODEL_LABELS[p.dataKey] || p.dataKey}</span>
          <span className="font-bold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Demand Forecast Page ─────────────────────────────────────────────────────
export default function DemandForecast() {
  const [selectedModels, setSelectedModels] = useState(["xgb","lstm","prophet"]);
  const [horizon, setHorizon]   = useState("7d");
  const [loading, setLoading]   = useState(false);

  const toggleModel = (m) => {
    setSelectedModels((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const runForecast = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/15 flex items-center justify-center">
              <TrendingUp size={16} className="text-brand-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Demand Forecasting</h1>
          </div>
          <p className="text-gray-500 text-sm">Multi-model AI forecast comparison with explainability</p>
        </div>
        <button onClick={runForecast} disabled={loading}
          className="btn-primary flex items-center gap-2 text-sm">
          {loading
            ? <><RefreshCw size={14} className="animate-spin" /> Running...</>
            : <><Zap size={14} /> Run Forecast</>
          }
        </button>
      </div>

      {/* Config Panel */}
      <motion.div className="card p-5"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex flex-wrap gap-6 items-start">
          {/* Model selection */}
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Select Models</p>
            <div className="flex flex-wrap gap-2">
              {MODELS.map((m) => (
                <button key={m} onClick={() => toggleModel(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
                    ${selectedModels.includes(m)
                      ? "border-transparent text-white shadow-sm"
                      : "border-white/10 text-gray-500 hover:text-white"
                    }`}
                  style={selectedModels.includes(m) ? { background: MODEL_COLORS[m] + "33", borderColor: MODEL_COLORS[m] + "66", color: MODEL_COLORS[m] } : {}}
                >
                  {MODEL_LABELS[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Horizon */}
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Forecast Horizon</p>
            <div className="flex gap-2">
              {["3d","7d","14d","30d"].map((h) => (
                <button key={h} onClick={() => setHorizon(h)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${horizon === h ? "bg-brand-500 text-white" : "bg-white/5 text-gray-400 hover:text-white"}`}>
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Best model badge */}
          <div className="ml-auto flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-4 py-2.5 rounded-xl">
            <Award size={16} className="text-brand-400" />
            <div>
              <p className="text-xs text-gray-400">Best Performing</p>
              <p className="text-sm font-bold text-brand-400">XGBoost (MAE: 3.1)</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Forecast Line Chart */}
        <motion.div className="card p-5 lg:col-span-2"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title">Order Volume Forecast</h2>
              <p className="text-gray-500 text-xs mt-0.5">Actual vs. predicted (dashed = future)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={forecastData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 170]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x="Sat" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4"
                label={{ value: "Forecast →", fill: "#6b7280", fontSize: 10, position: "insideTopLeft" }} />
              {/* Actual */}
              <Line dataKey="actual" name="actual" stroke="#fff" strokeWidth={2.5}
                dot={{ fill: "#fff", r: 4 }} connectNulls={false} />
              {/* Selected models */}
              {selectedModels.map((m) => (
                <Line key={m} dataKey={m} stroke={MODEL_COLORS[m]} strokeWidth={1.5}
                  strokeDasharray="5 3" dot={false} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-3 text-xs">
            <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-white inline-block"/><span className="text-gray-400">Actual</span></div>
            {selectedModels.map((m) => (
              <div key={m} className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 inline-block" style={{ background: MODEL_COLORS[m] }} />
                <span className="text-gray-400">{MODEL_LABELS[m]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feature Importance */}
        <motion.div className="card p-5"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center gap-2 mb-4">
            <Brain size={15} className="text-brand-400" />
            <h2 className="section-title text-sm">Feature Importance</h2>
            <div className="ml-auto group relative">
              <Info size={13} className="text-gray-600 cursor-help" />
              <div className="absolute right-0 top-5 w-48 text-xs bg-surface-700 border border-white/10 rounded-xl p-3 text-gray-400 hidden group-hover:block z-10">
                SHAP values showing which factors most influence demand prediction.
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {featureImportance.map((f, i) => (
              <div key={f.feature}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{f.feature}</span>
                  <span className="text-gray-300 font-medium">{(f.importance * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `hsl(${25 + i * 20}, 90%, 60%)` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${f.importance * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.07 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 text-xs text-gray-500">
            <p className="flex items-center gap-1"><Info size={10} /> Based on XGBoost SHAP values</p>
          </div>
        </motion.div>
      </div>

      {/* Model Comparison Table */}
      <motion.div className="card overflow-hidden"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <BarChart2 size={15} className="text-brand-400" />
            <h2 className="section-title">Model Accuracy Comparison</h2>
          </div>
          <span className="text-xs text-gray-500">Lower MAE/RMSE = Better | Higher R² = Better</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-head">
                <th className="table-cell">Model</th>
                <th className="table-cell">MAE ↓</th>
                <th className="table-cell">RMSE ↓</th>
                <th className="table-cell">MAPE ↓</th>
                <th className="table-cell">R² ↑</th>
                <th className="table-cell">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {modelMetrics.map((m) => (
                <tr key={m.model} className={`table-row ${m.winner ? "bg-brand-500/5" : ""}`}>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: m.color }} />
                      <span className={`font-semibold ${m.winner ? "text-brand-400" : "text-white"}`}>{m.model}</span>
                      {m.winner && <span className="badge badge-brand text-[10px] ml-1">Best</span>}
                    </div>
                  </td>
                  <td className="table-cell font-mono">{m.mae}</td>
                  <td className="table-cell font-mono">{m.rmse}</td>
                  <td className="table-cell font-mono">{m.mape}</td>
                  <td className="table-cell font-mono">{m.r2}</td>
                  <td className="table-cell">
                    {m.winner
                      ? <span className="flex items-center gap-1 text-green-400 text-xs font-medium"><CheckCircle2 size={12} /> Recommended</span>
                      : <span className="text-gray-500 text-xs">Acceptable</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Scenario Forecasts */}
      <motion.div className="card p-5"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={15} className="text-brand-400" />
          <h2 className="section-title">Scenario Forecasts</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {weeklyForecast.map((s) => (
            <div key={s.period} className="card p-4 space-y-2">
              <p className="text-xs text-gray-500 font-medium">{s.period}</p>
              <p className="text-3xl font-bold text-white">{s.predicted}</p>
              <p className="text-xs text-gray-500">orders predicted</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${s.up ? "text-green-400" : "text-red-400"}`}>
                  {s.change} vs avg
                </span>
                <span className="text-xs text-gray-600">{s.confidence} conf.</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
