/**
 * Skeleton Loaders
 * Production-grade shimmer placeholders for all content types.
 */

/** Base shimmer element */
export function Skeleton({ className = "" }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

/** Single line of text */
export function SkeletonText({ width = "w-full", className = "" }) {
  return <Skeleton className={`h-4 rounded-lg ${width} ${className}`} />;
}

/** A full stat card placeholder */
export function SkeletonStatCard() {
  return (
    <div className="stat-card" aria-hidden="true">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-28 rounded-lg mt-1" />
      <Skeleton className="h-3 w-16 rounded" />
    </div>
  );
}

/** A table row placeholder */
export function SkeletonTableRow({ cols = 6 }) {
  return (
    <tr className="border-t border-white/[0.05]" aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <Skeleton className={`h-4 rounded-lg ${i === 0 ? "w-32" : "w-20"}`} />
        </td>
      ))}
    </tr>
  );
}

/** A card placeholder */
export function SkeletonCard({ className = "" }) {
  return (
    <div className={`card p-5 space-y-4 ${className}`} aria-hidden="true">
      <div className="flex items-start gap-3">
        <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-5/6 rounded" />
      </div>
      <Skeleton className="h-9 w-full rounded-xl" />
    </div>
  );
}

/** Full-page loading screen */
export function PageLoader({ message = "Loading..." }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-64 gap-4"
      role="status"
      aria-label={message}
      aria-live="polite"
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-brand-500 animate-spin" />
        <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-brand-500/20 animate-pulse" />
      </div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

/** Inline button spinner */
export function ButtonSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
