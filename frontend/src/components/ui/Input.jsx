import { forwardRef } from "react";
import { Search, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState } from "react";

/**
 * Reusable Input Field component.
 * Handles: label, hint, error, prefix/suffix icons, password toggle.
 */
export const InputField = forwardRef(function InputField(
  {
    label,
    hint,
    error,
    success,
    leftIcon,
    rightElement,
    type = "text",
    required = false,
    id,
    className = "",
    wrapperClassName = "",
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;

  const inputClass = error
    ? "input-error"
    : success
    ? "input-success"
    : "input";

  return (
    <div className={`form-group ${wrapperClassName}`}>
      {label && (
        <label htmlFor={inputId} className="label-inline">
          {label}
          {required && <span className="text-red-400 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span
            className="absolute left-3.5 text-gray-500 pointer-events-none z-10"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          aria-required={required || undefined}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            [error && `${inputId}-error`, hint && `${inputId}-hint`]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={`
            ${inputClass}
            ${leftIcon ? "pl-10" : ""}
            ${isPassword || rightElement ? "pr-10" : ""}
            ${className}
          `.trim()}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {!isPassword && rightElement && (
          <div className="absolute right-3 text-gray-500">{rightElement}</div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="form-error" role="alert" aria-live="polite">
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="form-hint">{hint}</p>
      )}
    </div>
  );
});

/**
 * Search Input — pre-styled search bar.
 */
export const SearchInput = forwardRef(function SearchInput(
  { placeholder = "Search...", className = "", ...props },
  ref
) {
  return (
    <div className="relative">
      <Search
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={ref}
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        className={`input pl-9 ${className}`}
        {...props}
      />
    </div>
  );
});

/**
 * Select Field component.
 */
export const SelectField = forwardRef(function SelectField(
  { label, error, hint, options = [], required = false, id, wrapperClassName = "", ...props },
  ref
) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className={`form-group ${wrapperClassName}`}>
      {label && (
        <label htmlFor={selectId} className="label-inline">
          {label}
          {required && <span className="text-red-400 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        aria-required={required || undefined}
        aria-invalid={error ? "true" : undefined}
        className={`input ${error ? "input-error" : ""}`}
        {...props}
      >
        {options.map((opt) =>
          typeof opt === "string" ? (
            <option key={opt} value={opt} className="bg-surface-800">{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value} className="bg-surface-800">{opt.label}</option>
          )
        )}
      </select>
      {error && (
        <p className="form-error" role="alert"><AlertCircle size={12} aria-hidden="true" />{error}</p>
      )}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </div>
  );
});
