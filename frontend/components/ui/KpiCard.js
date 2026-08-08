import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const TONE_CLASS = {
  positive: "text-[var(--color-success)]",
  negative: "text-[var(--color-danger)]",
  neutral: "text-[var(--color-muted)]",
};

export default function KpiCard({ icon: Icon, iconClassName, label, value, trend }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-[var(--color-muted)]">{label}</span>
        {Icon && <Icon className={`w-5 h-5 ${iconClassName || "text-[var(--color-muted)]"}`} strokeWidth={1.75} />}
      </div>
      <div className="text-3xl font-semibold text-[var(--color-heading)] mb-2 tracking-tight">{value}</div>
      {trend ? (
        <div className={`text-xs font-medium flex items-center gap-1 ${TONE_CLASS[trend.tone] || TONE_CLASS.neutral}`}>
          {trend.direction === "up" && <ArrowUpRight className="w-3.5 h-3.5" />}
          {trend.direction === "down" && <ArrowDownRight className="w-3.5 h-3.5" />}
          <span>{trend.text}</span>
        </div>
      ) : (
        <div className="text-xs text-[var(--color-muted)]">Not enough data yet</div>
      )}
    </div>
  );
}
