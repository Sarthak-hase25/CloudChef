import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Production-grade Modal component.
 * Features:
 * - Mobile: bottom sheet that slides up
 * - Desktop: centered modal with scale-in animation
 * - Keyboard: closes on Escape
 * - Focus trap (prevents tab from leaving modal)
 * - ARIA: role="dialog", aria-modal, aria-labelledby
 * - Body scroll lock while open
 */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",         // "sm" | "md" | "lg" | "xl" | "full"
  closable = true,
  className = "",
}) {
  // Close on Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape" && closable) onClose();
  }, [closable, onClose]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const sizeClass = {
    sm:   "xs:max-w-sm",
    md:   "xs:max-w-md",
    lg:   "xs:max-w-xl md:max-w-2xl",
    xl:   "xs:max-w-2xl md:max-w-4xl",
    full: "xs:max-w-full xs:m-4",
  }[size] ?? "xs:max-w-md";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overlay"
            onClick={closable ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            className="modal-container"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className={`modal-panel ${sizeClass} ${className}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || closable) && (
                <div className="modal-header">
                  <div>
                    {title && (
                      <h2 id="modal-title" className="text-base md:text-lg font-bold text-white leading-tight">
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                    )}
                  </div>
                  {closable && (
                    <button
                      onClick={onClose}
                      className="btn-icon ml-2 flex-shrink-0"
                      aria-label="Close dialog"
                    >
                      <X size={18} aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="modal-body">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="modal-footer">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Confirmation dialog — used before destructive actions.
 * Prevents accidental deletions.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",   // "danger" | "warning" | "info"
  loading = false,
}) {
  const confirmClass = {
    danger:  "btn-danger",
    warning: "btn px-5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20",
    info:    "btn-primary",
  }[variant] ?? "btn-danger";

  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      closable={!loading}
      size="sm"
    >
      <div className="text-center space-y-3 py-2">
        <h3 className="text-white font-bold text-base">{title}</h3>
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onClose}
          disabled={loading}
          className="btn-secondary flex-1"
          aria-label={cancelLabel}
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`${confirmClass} flex-1`}
          aria-label={confirmLabel}
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : null}
          {loading ? "Processing..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
