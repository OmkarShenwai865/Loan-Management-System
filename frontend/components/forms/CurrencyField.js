"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";

function formatDisplay(value) {
  if (value === "" || value === undefined || value === null) return "";
  const num = Number(value);
  if (Number.isNaN(num)) return "";
  return new Intl.NumberFormat("en-IN").format(num);
}

export default function CurrencyField({
  control,
  name,
  label,
  icon: Icon,
  error,
  placeholder,
  disabled,
  className,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={className}>
          <label htmlFor={name} className="block text-sm font-medium text-[var(--color-body)] mb-1.5">
            {label}
          </label>
          <div className="relative">
            {Icon && (
              <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none" />
            )}
            <input
              id={name}
              inputMode="decimal"
              placeholder={placeholder}
              disabled={disabled}
              value={isFocused ? field.value ?? "" : formatDisplay(field.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                field.onBlur();
              }}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9.]/g, "");
                field.onChange(raw);
              }}
              aria-invalid={!!error}
              className={`w-full h-12 rounded-xl border bg-white text-sm text-[var(--color-heading)] placeholder:text-[var(--color-muted)] transition-colors duration-150 focus:outline-none focus:ring-2 disabled:bg-[var(--color-app-bg)] disabled:cursor-not-allowed ${
                Icon ? "pl-10" : "pl-3.5"
              } pr-3.5 ${
                error
                  ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20"
                  : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
              }`}
            />
          </div>
          {error && <p className="mt-1.5 text-xs text-[var(--color-danger)]">{error}</p>}
        </div>
      )}
    />
  );
}
