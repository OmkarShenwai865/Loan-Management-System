import { ShieldCheck } from "lucide-react";

export default function BreInfoBanner() {
  return (
    <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 sm:p-5 mb-6">
      <div className="w-9 h-9 rounded-lg bg-white border border-blue-100 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-4.5 h-4.5 text-[var(--color-primary)]" strokeWidth={1.75} />
      </div>
      <p className="text-sm text-blue-900 leading-relaxed pt-1.5">
        Changes made here are immediately applied to future loan eligibility evaluations. No
        application restart or deployment is required.
      </p>
    </div>
  );
}
