/**
 * CloudKitchen AI — Design Tokens
 *
 * Single source of truth for all design decisions.
 * Import this in components that need token values in JS.
 * CSS equivalents live in index.css and tailwind.config.js
 */

// ─── Brand ────────────────────────────────────────────────
export const BRAND = {
  name:    "CloudKitchen AI",
  tagline: "Smart Kitchen Management Platform",
  domain:  "cloudkitchen.ai",
};

// ─── Page Titles ──────────────────────────────────────────
export const PAGE_TITLES = {
  dashboard:      "Dashboard",
  orders:         "Orders",
  menu:           "Menu",
  inventory:      "Inventory",
  customers:      "Customers",
  suppliers:      "Suppliers",
  kitchen:        "Kitchen Ops",
  reports:        "Reports",
  settings:       "Settings",
  login:          "Sign In",
  "ai/demand":    "Demand Forecast",
  "ai/inventory": "Inventory AI",
  "ai/waste":     "Waste Predictor",
  "ai/pricing":   "Dynamic Pricing",
  "ai/recommendations": "Recommendations",
  "404":          "Page Not Found",
};

export const formatTitle = (page) =>
  page ? `${page} • ${BRAND.name}` : BRAND.name;

// ─── Color Tokens (JS-side reference) ─────────────────────
export const COLORS = {
  brand:    "#f97316",
  brandDk:  "#ea580c",
  surface:  "#0a0a0f",
  card:     "#111118",
  border:   "rgba(255,255,255,0.08)",
  text:     "#f3f4f6",
  muted:    "#6b7280",
  success:  "#22c55e",
  warning:  "#f59e0b",
  danger:   "#ef4444",
  info:     "#3b82f6",
};

// ─── Spacing Scale ─────────────────────────────────────────
export const SPACING = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  "2xl": 48,
  "3xl": 64,
};

// ─── Border Radii ──────────────────────────────────────────
export const RADIUS = {
  sm:   "0.5rem",   // 8px
  md:   "0.75rem",  // 12px
  lg:   "1rem",     // 16px
  xl:   "1.5rem",   // 24px
  full: "9999px",
};

// ─── Font Sizes ────────────────────────────────────────────
export const FONT_SIZE = {
  "2xs": "0.625rem",  // 10px — micro labels
  xs:    "0.75rem",   // 12px — captions
  sm:    "0.875rem",  // 14px — body small
  base:  "1rem",      // 16px — body
  lg:    "1.125rem",  // 18px — subheading
  xl:    "1.25rem",   // 20px — heading small
  "2xl": "1.5rem",    // 24px — heading
  "3xl": "1.875rem",  // 30px — display
};

// ─── Font Weights ──────────────────────────────────────────
export const FONT_WEIGHT = {
  normal:    400,
  medium:    500,
  semibold:  600,
  bold:      700,
  extrabold: 800,
};

// ─── Shadows ───────────────────────────────────────────────
export const SHADOWS = {
  glow:  "0 0 20px rgba(249, 115, 22, 0.35)",
  card:  "0 4px 24px rgba(0, 0, 0, 0.3)",
  modal: "0 25px 60px rgba(0, 0, 0, 0.7)",
};

// ─── Animations ────────────────────────────────────────────
export const ANIMATION = {
  fast:   0.15,
  normal: 0.25,
  slow:   0.4,
  spring: { type: "spring", stiffness: 360, damping: 32 },
};

// ─── Z-Index ───────────────────────────────────────────────
export const Z = {
  base:    0,
  card:    10,
  sticky:  20,
  dropdown:30,
  overlay: 40,
  sidebar: 50,
  modal:   60,
  toast:   70,
};

// ─── Breakpoints ───────────────────────────────────────────
export const BREAKPOINTS = {
  xs:   320,
  sm:   480,
  md:   768,
  lg:   1024,
  xl:   1280,
  "2xl": 1440,
  "3xl": 1920,
};
