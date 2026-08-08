import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const SelectField = forwardRef(function SelectField(
  { label, icon: Icon, error, helper, options, className, ...rest },
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
        <select
          id={rest.name}
          ref={ref}
          className={`w-full h-12 rounded-xl border bg-white text-sm text-[var(--color-heading)] appearance-none transition-colors duration-150 focus:outline-none focus:ring-2 disabled:bg-[var(--color-app-bg)] disabled:cursor-not-allowed ${
            Icon ? "pl-10" : "pl-3.5"
          } pr-9 ${
            error
              ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20"
              : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
          }`}
          aria-invalid={!!error}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none" />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-[var(--color-danger)]">{error}</p>
      ) : (
        helper && <p className="mt-1.5 text-xs text-[var(--color-muted)]">{helper}</p>
      )}
    </div>
  );
});

export default SelectField;
