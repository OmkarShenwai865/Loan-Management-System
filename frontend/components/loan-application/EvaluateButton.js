import { ArrowRight, Loader2 } from "lucide-react";

export default function EvaluateButton({ loading, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full h-[52px] rounded-xl bg-[var(--color-primary)] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[var(--color-primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="w-4.5 h-4.5 animate-spin" />
          Evaluating...
        </>
      ) : (
        <>
          Evaluate Eligibility
          <ArrowRight className="w-4.5 h-4.5" />
        </>
      )}
    </button>
  );
}
