import {
  AlertTriangle,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ClipboardList,
  Home,
  IndianRupee,
  RotateCcw,
  UserX,
  WifiOff,
  X,
  XCircle,
} from "lucide-react";
import { CREDIT_SCORE_TONE, categorizeCreditScore } from "@/lib/creditScore";

const LOAN_TYPE_LABELS = {
  HOME_LOAN: "Home Loan",
  LAP: "Loan Against Property",
};

const EMPLOYMENT_TYPE_LABELS = {
  SALARIED: "Salaried",
  SELF_EMPLOYED: "Self Employed",
};

const SCORE_DESCRIPTION = {
  Excellent: "Excellent credit health",
  Good: "Good credit standing",
  Average: "Average credit profile — may affect eligibility",
  Poor: "Credit score needs improvement",
  "No Data": "Credit score unavailable",
};

const ERROR_CONFIG = {
  duplicate: {
    icon: UserX,
    title: "Application Already Exists",
    message: "This mobile number is already registered. Please use a different number or contact support.",
  },
  network: {
    icon: WifiOff,
    title: "Connection Problem",
    message: "We couldn't reach the server. Check your connection and try again.",
  },
  generic: {
    icon: AlertTriangle,
    title: "Something Went Wrong",
    message: "We couldn't evaluate this application right now. Please try again.",
  },
};

function formatCurrency(value) {
  const num = Number(value);
  if (!value || Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

function StatusRow({ passed, text }) {
  return (
    <div
      className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg text-sm ${
        passed ? "bg-[var(--color-success-soft)]" : "bg-[var(--color-danger-soft)]"
      }`}
    >
      {passed ? (
        <Check className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-success)]" />
      ) : (
        <X className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-danger)]" />
      )}
      <span className={passed ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}>{text}</span>
    </div>
  );
}

function MiniCard({ icon: Icon, label, value, className }) {
  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-xl border border-[var(--color-border)] bg-white ${className || ""}`}>
      <div className="w-8 h-8 rounded-lg bg-[var(--color-app-bg)] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[var(--color-muted)]" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-[var(--color-muted)] leading-none mb-1">{label}</p>
        <p className="text-sm font-medium text-[var(--color-heading)] truncate">{value}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 sm:px-8">
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-app-bg)] flex items-center justify-center mb-4">
        <ClipboardList className="w-6 h-6 text-[var(--color-muted)]" strokeWidth={1.75} />
      </div>
      <p className="text-sm text-[var(--color-muted)] max-w-xs leading-relaxed">
        Complete the application form and click{" "}
        <span className="font-medium text-[var(--color-body)]">Evaluate Eligibility</span> to
        retrieve the customer&apos;s credit score and determine loan eligibility.
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-6 sm:p-8 space-y-6 animate-pulse">
      <div>
        <div className="h-3 w-24 bg-[var(--color-border)] rounded mb-3" />
        <div className="h-9 w-28 bg-[var(--color-border)] rounded" />
      </div>
      <div className="h-20 w-full bg-[var(--color-border)] rounded-xl" />
      <div className="space-y-2">
        <div className="h-10 w-full bg-[var(--color-border)] rounded-lg" />
        <div className="h-10 w-full bg-[var(--color-border)] rounded-lg" />
        <div className="h-10 w-full bg-[var(--color-border)] rounded-lg" />
      </div>
    </div>
  );
}

function ErrorState({ errorType, errorMessage, onRetry }) {
  const config = ERROR_CONFIG[errorType] || ERROR_CONFIG.generic;
  const Icon = config.icon;

  return (
    <div className="p-6 sm:p-8 text-center">
      <div className="w-12 h-12 rounded-xl bg-[var(--color-danger-soft)] flex items-center justify-center mx-auto mb-4">
        <Icon className="w-5 h-5 text-[var(--color-danger)]" strokeWidth={1.75} />
      </div>
      <h3 className="text-sm font-semibold text-[var(--color-heading)] mb-1.5">{config.title}</h3>
      <p className="text-sm text-[var(--color-muted)] mb-5">{errorMessage || config.message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-150"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}

function ResultState({ result, formValues }) {
  const isEligible = result.bre_status === "Eligible" || result.bre_status === "ELIGIBLE";
  const reasons = result.reasons || [];
  const scoreCategory = categorizeCreditScore(result.credit_score);
  const scoreTone = CREDIT_SCORE_TONE[scoreCategory];
  const scoreDescription = SCORE_DESCRIPTION[scoreCategory];

  return (
    <div className="animate-fade-in-up">
      <div className="p-6 sm:p-8 border-b border-[var(--color-border)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-3">
          Credit Score
        </p>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-4xl font-bold text-[var(--color-heading)] tracking-tight">
            {result.credit_score ?? "N/A"}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${scoreTone.badge}`}>
            {scoreCategory}
          </span>
        </div>
        <p className="text-xs text-[var(--color-muted)]">{scoreDescription}</p>
      </div>

      <div
        className={`p-6 sm:p-8 border-b border-[var(--color-border)] ${
          isEligible ? "bg-[var(--color-success-soft)]/40" : "bg-[var(--color-danger-soft)]/40"
        }`}
      >
        <div className="flex items-center gap-3 mb-1.5">
          {isEligible ? (
            <CheckCircle2 className="w-6 h-6 text-[var(--color-success)]" strokeWidth={1.75} />
          ) : (
            <XCircle className="w-6 h-6 text-[var(--color-danger)]" strokeWidth={1.75} />
          )}
          <span
            className={`text-lg font-bold ${isEligible ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}
          >
            {isEligible ? "Eligible" : "Not Eligible"}
          </span>
        </div>
        <p className="text-sm text-[var(--color-body)] ml-9">
          {isEligible
            ? "All business rules satisfied."
            : `${reasons.length} rule${reasons.length !== 1 ? "s" : ""} failed.`}
        </p>
      </div>

      <div className="p-6 sm:p-8 border-b border-[var(--color-border)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-3">
          Evaluation Notes
        </p>
        <div className="space-y-2">
          {isEligible ? (
            <StatusRow passed text="All configured business rules passed" />
          ) : (
            reasons.map((reason, i) => <StatusRow key={i} passed={false} text={reason} />)
          )}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-3">
          Application Summary
        </p>
        <div className="grid grid-cols-2 gap-3">
          <MiniCard icon={Building2} label="Loan Type" value={LOAN_TYPE_LABELS[formValues.loan_type]} />
          <MiniCard
            icon={Briefcase}
            label="Employment"
            value={EMPLOYMENT_TYPE_LABELS[formValues.employment_type]}
          />
          <MiniCard icon={IndianRupee} label="Income" value={formatCurrency(formValues.monthly_income)} />
          <MiniCard
            icon={IndianRupee}
            label="Loan Amount"
            value={formatCurrency(formValues.loan_amount_required)}
          />
          <MiniCard
            icon={Home}
            label="Property Value"
            value={formatCurrency(formValues.property_value)}
            className="col-span-2"
          />
        </div>
      </div>
    </div>
  );
}

export default function EligibilitySummaryPanel({ state, result, formValues, errorType, errorMessage, onRetry }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden lg:sticky lg:top-6">
      <div className="px-6 sm:px-8 py-5 border-b border-[var(--color-border)]">
        <h2 className="text-sm font-semibold text-[var(--color-heading)]">Eligibility Summary</h2>
      </div>

      {state === "idle" && <EmptyState />}
      {state === "loading" && <LoadingSkeleton />}
      {state === "error" && <ErrorState errorType={errorType} errorMessage={errorMessage} onRetry={onRetry} />}
      {state === "success" && result && <ResultState result={result} formValues={formValues} />}
    </div>
  );
}
