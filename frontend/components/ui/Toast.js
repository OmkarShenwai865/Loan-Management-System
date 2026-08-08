"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const ICONS = {
  success: { icon: CheckCircle2, className: "text-[var(--color-success)]" },
  error: { icon: AlertCircle, className: "text-[var(--color-danger)]" },
};

export default function Toast({ message, type = "success", onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const { icon: Icon, className } = ICONS[type] || ICONS.success;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
      <div className="flex items-center gap-3 bg-white border border-[var(--color-border)] rounded-xl shadow-lg pl-4 pr-3 py-3">
        <Icon className={`w-5 h-5 shrink-0 ${className}`} strokeWidth={1.75} />
        <p className="text-sm font-medium text-[var(--color-heading)]">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-[var(--color-muted)] hover:text-[var(--color-heading)] transition-colors duration-150"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
