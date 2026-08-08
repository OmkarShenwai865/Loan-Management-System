import { forwardRef } from "react";

const TextField = forwardRef(function TextField(
  { label, icon: Icon, error, helper, className, ...rest },
  ref
) {
  return (
    <div className={className}>
      <label htmlFor={rest.name} className="block text-sm font-medium text-[var(--color-body)] mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none" />
        )}
        <input
          id={rest.name}
          ref={ref}
          className={`w-full h-12 rounded-xl border bg-white text-sm text-[var(--color-heading)] placeholder:text-[var(--color-muted)] transition-colors duration-150 focus:outline-none focus:ring-2 disabled:bg-[var(--color-app-bg)] disabled:cursor-not-allowed ${
            Icon ? "pl-10" : "pl-3.5"
          } pr-3.5 ${
            error
              ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20"
              : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
          }`}
          aria-invalid={!!error}
          {...rest}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-[var(--color-danger)]">{error}</p>
      ) : (
        helper && <p className="mt-1.5 text-xs text-[var(--color-muted)]">{helper}</p>
      )}
    </div>
  );
});

export default TextField;
