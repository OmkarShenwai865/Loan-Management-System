import { forwardRef } from "react";

const Toggle = forwardRef(function Toggle({ label, description, ...rest }, ref) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <div>
        {label && <span className="block text-sm font-medium text-[var(--color-body)]">{label}</span>}
        {description && <span className="block text-xs text-[var(--color-muted)] mt-0.5">{description}</span>}
      </div>
      <span className="relative inline-flex items-center shrink-0">
        <input ref={ref} type="checkbox" className="sr-only peer" {...rest} />
        <span className="w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-[var(--color-primary)] transition-colors duration-200" />
        <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
      </span>
    </label>
  );
});

export default Toggle;
