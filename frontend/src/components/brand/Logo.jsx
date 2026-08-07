/**
 * CloudKitchen AI — SVG Logo Component
 *
 * A professional, scalable logo combining:
 * - Cloud shape (cloud-native SaaS)
 * - Flame/heat element (kitchen)
 * - Neural network dots (AI)
 *
 * Usage:
 *   <Logo />                   — full logo (icon + wordmark)
 *   <Logo variant="icon" />    — icon only
 *   <Logo variant="wordmark" /> — text only
 *   <Logo size="lg" />
 */

import { BRAND } from "../../design-system/tokens";

// ─── SVG Icon ──────────────────────────────────────────────
export function LogoIcon({ size = 36, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ck-brand" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="40" height="40" rx="11" fill="url(#ck-brand)" />

      {/* Cloud body */}
      <path
        d="M10 24c0-4.4 3.6-8 8-8 .6 0 1.2.1 1.8.2C21 13.4 23.3 12 26 12c3.3 0 6 2.7 6 6 0 .3 0 .5-.1.8.8.7 1.3 1.7 1.1 2.8-.3 1.8-1.9 3.2-3.7 3.2H12c-1.1 0-2-1-2-2v-2.8z"
        fill="white"
        fillOpacity="0.95"
      />

      {/* Flame tip — AI energy */}
      <path
        d="M20 26c0 0 1.2-2.5 1.2-4.5S19 18 20 15.5c.6 2.5 2.5 3 2.5 5.5S20 26 20 26z"
        fill="url(#ck-brand)"
      />

      {/* Neural dots — AI layer */}
      <circle cx="14" cy="29" r="1.2" fill="white" fillOpacity="0.7" />
      <circle cx="20" cy="31" r="1.5" fill="white" fillOpacity="0.9" />
      <circle cx="26" cy="29" r="1.2" fill="white" fillOpacity="0.7" />
      <line x1="14" y1="29" x2="20" y2="31" stroke="white" strokeOpacity="0.35" strokeWidth="0.8" />
      <line x1="20" y1="31" x2="26" y2="29" stroke="white" strokeOpacity="0.35" strokeWidth="0.8" />
    </svg>
  );
}

// ─── Wordmark ──────────────────────────────────────────────
export function LogoWordmark({ className = "" }) {
  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <span
        className="font-bold text-white text-sm tracking-tight leading-none"
        style={{ letterSpacing: "-0.02em" }}
      >
        CloudKitchen
      </span>
      <span
        className="text-[10px] font-semibold tracking-widest uppercase mt-0.5"
        style={{
          background: "linear-gradient(90deg, #f97316, #fb923c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        AI Platform
      </span>
    </div>
  );
}

// ─── Full Logo (icon + wordmark) ───────────────────────────
export function Logo({
  variant = "full",  // "full" | "icon" | "wordmark"
  size = 36,
  className = "",
}) {
  if (variant === "icon") {
    return <LogoIcon size={size} className={className} />;
  }
  if (variant === "wordmark") {
    return <LogoWordmark className={className} />;
  }
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label={BRAND.name}>
      <LogoIcon size={size} />
      <LogoWordmark />
    </div>
  );
}

export default Logo;
