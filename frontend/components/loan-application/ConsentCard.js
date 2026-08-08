import { ShieldCheck } from "lucide-react";

export default function ConsentCard({ register, error, disabled }) {
  return (
    <div className="bg-[var(--color-app-bg)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6">
      <div className="flex items-start gap-3.5">
        <div className="shrink-0 w-9 h-9 rounded-lg bg-white border border-[var(--color-border)] flex items-center justify-center">
          <ShieldCheck className="w-4.5 h-4.5 text-[var(--color-primary)]" strokeWidth={1.75} />
        </div>
        <label className="flex items-start gap-2.5 cursor-pointer flex-1">
          <input
            type="checkbox"
            disabled={disabled}
            className="mt-1 w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
            {...register("consent_given")}
          />
          <span className="text-sm text-[var(--color-body)] leading-relaxed">
            I consent to my information being shared with lending partners for loan processing
            purposes. Your data is handled securely and used solely to evaluate this application.{" "}
            <span className="text-[var(--color-danger)]">*</span>
          </span>
        </label>
      </div>
      {error && <p className="mt-2 ml-[52px] text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}
