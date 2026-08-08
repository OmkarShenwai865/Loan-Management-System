import Link from "next/link";
import { ArrowRight, CheckCircle2, Gauge, Lock, ShieldCheck, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Gauge,
    title: "Instant Eligibility Checks",
    description: "Fetch a credit score and evaluate every application in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Configurable Rule Engine",
    description: "Eligibility rules live in the database — update them without a deployment.",
  },
  {
    icon: Users,
    title: "Centralized Lead Management",
    description: "Search, filter, and review every application from one console.",
  },
];

const CAPABILITIES = ["Credit Bureau Integration", "Dynamic BRE", "Django REST API", "Secure Admin Console"];

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col bg-[var(--color-app-bg)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-[var(--color-heading)]">Loan Management</span>
            <span className="text-xs text-[var(--color-muted)] hidden sm:inline">
              Loan Eligibility Platform
            </span>
          </div>
          <span className="text-xs text-[var(--color-muted)]">Secure Admin Console</span>
        </div>
      </header>

      <main className="flex-1 flex items-center px-4 sm:px-6">
        <div className="max-w-5xl w-full mx-auto py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-3">
                Loan Eligibility Platform
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--color-heading)] tracking-tight">
                Loan Eligibility &<br />Lead Management
              </h1>
              <p className="text-[var(--color-muted)] mt-4 max-w-md">
                Evaluate loan applications, assess credit eligibility, and manage lending leads
                from one secure workspace.
              </p>

              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 h-12 px-6 mt-7 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors duration-150"
              >
                Admin Login
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-1.5 mt-3 text-xs text-[var(--color-muted)]">
                <Lock className="w-3.5 h-3.5" strokeWidth={1.75} />
                Secure Admin Access
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--color-border)]">
                <h2 className="text-sm font-semibold text-[var(--color-heading)]">Eligibility Overview</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-[var(--color-muted)] mb-1">Credit Score</p>
                  <p className="text-3xl font-bold text-[var(--color-heading)] tracking-tight">742</p>
                </div>
                <div className="flex items-center gap-2 bg-[var(--color-success-soft)] text-[var(--color-success)] rounded-lg px-3 py-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
                  Eligible
                </div>
                <div>
                  <p className="text-xs text-[var(--color-muted)] mb-1">BRE Evaluation</p>
                  <p className="text-sm text-[var(--color-body)]">All configured rules passed</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                  <span className="text-xs text-[var(--color-muted)]">Application</span>
                  <span className="text-sm font-medium text-[var(--color-heading)]">Home Loan</span>
                </div>
              </div>
              <div className="px-5 py-2 bg-[var(--color-app-bg)] text-center">
                <span className="text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
                  Sample preview
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 text-left">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-[var(--color-primary)]" strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-semibold text-[var(--color-muted)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--color-heading)] mb-1">{feature.title}</h3>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2.5 flex-wrap mt-10 text-xs text-[var(--color-muted)]">
            {CAPABILITIES.map((cap, i) => (
              <span key={cap} className="flex items-center gap-2.5">
                {i > 0 && <span aria-hidden="true">&middot;</span>}
                {cap}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
