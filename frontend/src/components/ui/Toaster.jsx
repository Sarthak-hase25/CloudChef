// Minimal toaster — replace with a full toast lib later
import { useState, useEffect, createContext, useContext, useCallback } from "react";

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const colors = {
    success: "bg-green-500/20 border-green-500/30 text-green-300",
    error:   "bg-red-500/20 border-red-500/30 text-red-300",
    warning: "bg-yellow-500/20 border-yellow-500/30 text-yellow-300",
    info:    "bg-blue-500/20 border-blue-500/30 text-blue-300",
  };

  return (
    <ToastCtx.Provider value={addToast}>
      <div className="fixed bottom-5 right-5 z-50 space-y-2">
        {toasts.map(({ id, msg, type }) => (
          <div key={id} className={`px-4 py-3 rounded-xl border text-sm backdrop-blur-sm animate-slide-up ${colors[type]}`}>
            {msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
