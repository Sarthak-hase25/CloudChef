import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Logo } from "../components/brand/Logo";
import { usePageTitle } from "../components/brand/PageTitle";

export default function NotFound() {
  usePageTitle("Page Not Found");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo top */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-8"
      >
        <Logo size={32} />
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-center max-w-md relative z-10 space-y-8"
      >
        {/* 404 Display */}
        <div className="relative">
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="text-[120px] md:text-[160px] font-extrabold leading-none select-none"
            style={{
              background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.05em",
            }}
            aria-hidden="true"
          >
            404
          </motion.p>

          {/* Floating icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <div className="w-20 h-20 rounded-3xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Search size={32} className="text-brand-500/60" aria-hidden="true" />
            </div>
          </motion.div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Page not found
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col xs:flex-row gap-3 justify-center">
          <motion.button
            onClick={() => navigate("/dashboard")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary px-6"
            aria-label="Go to dashboard"
          >
            <Home size={16} aria-hidden="true" />
            Go to Dashboard
          </motion.button>
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary px-6"
            aria-label="Go back"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Go Back
          </motion.button>
        </div>
      </motion.div>

      {/* Bottom decoration */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-8 text-xs text-gray-700"
      >
        © 2026 CloudKitchen AI
      </motion.p>
    </div>
  );
}
