import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { Logo } from "../../components/brand/Logo";
import { usePageTitle } from "../../components/brand/PageTitle";

const DEMO_EMAIL    = "owner@cloudkitchen.ai";
const DEMO_PASSWORD = "password123";

const FEATURES = [
  { icon: Zap,         text: "AI-powered demand forecasting" },
  { icon: TrendingUp,  text: "Real-time revenue analytics" },
  { icon: Shield,      text: "Enterprise-grade security" },
];

export default function Login() {
  usePageTitle("Sign In");

  const navigate = useNavigate();
  const login    = useAuthStore((s) => s.login);
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    setApiError("");
    try {
      const res  = await fetch("http://localhost:5000/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      login(
        { name: data.user.name, email: data.user.email, role: data.user.role, kitchenId: data.user.kitchenId },
        data.token
      );
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setValue("email",    DEMO_EMAIL);
    setValue("password", DEMO_PASSWORD);
  };

  return (
    <div className="min-h-screen bg-surface-900 flex overflow-hidden" role="main">
      {/* ─── Left Panel — Branding ─── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-800 via-surface-900 to-surface-950" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600/6 rounded-full blur-[80px]" />
        </div>

        {/* Grid decoration */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <Logo size={44} />
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl xl:text-5xl font-bold text-white leading-tight"
              style={{ letterSpacing: "-0.03em" }}
            >
              Run your kitchen
              <span
                className="block"
                style={{
                  background: "linear-gradient(135deg, #f97316, #fb923c, #fbbf24)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                smarter with AI.
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-lg mt-4 leading-relaxed max-w-md"
            >
              Predict demand, optimize inventory, reduce waste, and maximize
              revenue — all in one intelligent platform.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-brand-400" aria-hidden="true" />
                </div>
                <span className="text-gray-300 text-sm">{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10">
          <p className="text-gray-700 text-xs">
            © 2026 CloudKitchen AI. All rights reserved.
          </p>
        </div>
      </div>

      {/* ─── Right Panel — Form ─── */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8 lg:p-12 bg-surface-950 lg:bg-surface-900 relative">
        {/* Mobile-only background glow */}
        <div className="lg:hidden absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-brand-500/8 rounded-full blur-[80px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Mobile logo */}
          <div className="flex justify-center mb-10 lg:hidden">
            <Logo size={40} />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1
              className="text-2xl font-bold text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to your dashboard
            </p>
          </div>

          {/* Demo access banner */}
          <motion.button
            type="button"
            onClick={fillDemo}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            className="
              w-full flex items-center justify-between
              px-4 py-3 mb-6 rounded-xl
              bg-brand-500/8 border border-brand-500/20
              text-left group transition-all hover:bg-brand-500/12 hover:border-brand-500/30
            "
            aria-label="Fill in demo credentials"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                <Zap size={13} className="text-brand-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-400">Try Demo Account</p>
                <p className="text-[11px] text-gray-500 mt-0.5">owner@cloudkitchen.ai</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-brand-500/50 group-hover:text-brand-400 transition-colors" aria-hidden="true" />
          </motion.button>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="label-inline">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@kitchen.com"
                aria-invalid={errors.email ? "true" : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`input ${errors.email ? "input-error" : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                })}
              />
              {errors.email && (
                <p id="email-error" className="form-error" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="label-inline">
                  Password
                </label>
                <button type="button" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={errors.password ? "true" : undefined}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`input pr-12 ${errors.password ? "input-error" : ""}`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="form-error" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm"
                role="alert"
                aria-live="assertive"
              >
                {apiError}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : undefined}
              whileTap={!loading ? { scale: 0.99 } : undefined}
              className="btn-primary w-full mt-2"
              aria-label={loading ? "Signing in..." : "Sign in"}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-700 mt-8">
            By signing in, you agree to our{" "}
            <span className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
            {" "}and{" "}
            <span className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
