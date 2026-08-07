import { forwardRef } from "react";
import { ButtonSpinner } from "./Skeleton";

/**
 * Production-grade Button component.
 * Handles: variants, sizes, loading state, icons, accessibility.
 */
export const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    type = "button",
    className = "",
    "aria-label": ariaLabel,
    ...props
  },
  ref
) {
  const variantClass = {
    primary:   "btn-primary",
    secondary: "btn-secondary",
    danger:    "btn-danger",
    ghost:     "btn-ghost",
    icon:      "btn-icon",
  }[variant] ?? "btn-primary";

  const sizeClass = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  }[size] ?? "";

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      className={`
        ${variantClass}
        ${sizeClass}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `.trim()}
      {...props}
    >
      {loading ? (
        <ButtonSpinner />
      ) : (
        leftIcon && <span aria-hidden="true">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && (
        <span aria-hidden="true">{rightIcon}</span>
      )}
    </button>
  );
});

/**
 * Icon Button — square button with just an icon.
 */
export const IconButton = forwardRef(function IconButton(
  { icon, label, size = 18, className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={`btn-icon ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
});
