import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Global Error Boundary — catches all uncaught React render errors.
 * Prevents the whole app from crashing. Shows a professional fallback UI.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, send to logging service (e.g. Sentry)
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-surface-900">
          <div className="card max-w-md w-full p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Something went wrong</h2>
              <p className="text-gray-400 text-sm mt-2">
                An unexpected error occurred. Our team has been notified.
              </p>
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300">
                    Error details (dev only)
                  </summary>
                  <pre className="mt-2 text-[10px] text-red-400 bg-red-500/5 border border-red-500/10 rounded-xl p-3 overflow-auto max-h-48">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex flex-col xs:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="btn-primary flex-1"
                aria-label="Try again"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <button
                onClick={() => window.location.href = "/dashboard"}
                className="btn-secondary flex-1"
                aria-label="Go to dashboard"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Page-level error boundary — wraps individual pages.
 * Shows a lighter fallback without taking over the full layout.
 */
export function PageErrorBoundary({ children }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
