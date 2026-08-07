import { AlertCircle, RefreshCw, WifiOff, ShieldOff, Clock, ServerCrash } from "lucide-react";

const ERROR_CONFIGS = {
  404: { icon: AlertCircle,  title: "Not Found",          message: "The resource you're looking for doesn't exist.",  color: "text-gray-400" },
  401: { icon: ShieldOff,    title: "Session Expired",    message: "Please sign in again to continue.",               color: "text-yellow-400" },
  403: { icon: ShieldOff,    title: "Access Denied",      message: "You don't have permission to view this content.", color: "text-orange-400" },
  500: { icon: ServerCrash,  title: "Server Error",       message: "Something went wrong on our end. Try again.",     color: "text-red-400" },
  offline: { icon: WifiOff,  title: "No Connection",      message: "Check your internet connection and try again.",   color: "text-blue-400" },
  timeout: { icon: Clock,    title: "Request Timed Out",  message: "The server took too long to respond.",            color: "text-orange-400" },
  default: { icon: AlertCircle, title: "Something Went Wrong", message: "An unexpected error occurred. Please try again.", color: "text-red-400" },
};

/**
 * Empty State — shown when a module has no data.
 */
export function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
  className = "",
}) {
  return (
    <div className={`empty-state ${className}`} role="status">
      {Icon && (
        <div className="empty-icon">
          <Icon size={28} aria-hidden="true" />
        </div>
      )}
      <div>
        <h3 className="text-white font-semibold text-base">{title}</h3>
        {message && <p className="text-gray-500 text-sm mt-1 max-w-sm">{message}</p>}
      </div>
      {(actionLabel || secondaryLabel) && (
        <div className="flex flex-col xs:flex-row gap-3 mt-2">
          {actionLabel && (
            <button onClick={onAction} className="btn-primary px-5">
              {actionLabel}
            </button>
          )}
          {secondaryLabel && (
            <button onClick={onSecondaryAction} className="btn-secondary px-5">
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Error State — shown when an API call fails.
 */
export function ErrorState({
  code,
  title,
  message,
  onRetry,
  className = "",
}) {
  const config = ERROR_CONFIGS[code] || ERROR_CONFIGS.default;
  const Icon = config.icon;
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  return (
    <div className={`empty-state ${className}`} role="alert" aria-live="assertive">
      <div className={`empty-icon ${code === 401 || code === 403 ? "bg-yellow-500/10 border-yellow-500/20" : "bg-red-500/10 border-red-500/20"}`}>
        <Icon size={28} className={config.color} aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-white font-semibold text-base">{displayTitle}</h3>
        <p className="text-gray-500 text-sm mt-1 max-w-sm">{displayMessage}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary px-5">
          <RefreshCw size={15} aria-hidden="true" />
          Try Again
        </button>
      )}
    </div>
  );
}
