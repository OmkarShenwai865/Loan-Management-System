"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, ClipboardList, RotateCcw } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import StatusBadge from "@/components/ui/StatusBadge";
import CreditScoreCell from "@/components/ui/CreditScoreCell";

const LOAN_TYPE_LABELS = {
  HOME_LOAN: "Home Loan",
  LAP: "Loan Against Property",
};

function LoanTypeBadge({ type }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
      {LOAN_TYPE_LABELS[type] || type}
    </span>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function SkeletonRows({ rows = 6 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={i} className="border-b border-[var(--color-border)] animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 w-10 bg-[var(--color-app-bg)] rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-app-bg)]" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-28 bg-[var(--color-app-bg)] rounded" />
            <div className="h-3 w-20 bg-[var(--color-app-bg)] rounded" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-20 bg-[var(--color-app-bg)] rounded-full" />
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-16 bg-[var(--color-app-bg)] rounded-full" />
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-20 bg-[var(--color-app-bg)] rounded-full" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-24 bg-[var(--color-app-bg)] rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-14 bg-[var(--color-app-bg)] rounded ml-auto" />
      </td>
    </tr>
  ));
}

function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-app-bg)] flex items-center justify-center mb-4">
        <ClipboardList className="w-6 h-6 text-[var(--color-muted)]" strokeWidth={1.75} />
      </div>
      <h3 className="text-sm font-semibold text-[var(--color-heading)] mb-1.5">No Loan Applications Found</h3>
      <p className="text-sm text-[var(--color-muted)] max-w-xs mb-5">
        No applications match the selected filters.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-150"
      >
        <RotateCcw className="w-4 h-4" />
        Reset Filters
      </button>
    </div>
  );
}

export default function LeadsTable({ leads, loading, onReset }) {
  const router = useRouter();
  const isEmpty = !loading && leads.length === 0;

  function goToLead(id) {
    router.push(`/admin/leads/${id}`);
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
      {isEmpty ? (
        <EmptyState onReset={onReset} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left text-[var(--color-muted)] border-b border-[var(--color-border)]">
                  <th className="px-6 py-3 font-medium">Lead ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Loan Type</th>
                  <th className="px-6 py-3 font-medium">Credit Score</th>
                  <th className="px-6 py-3 font-medium">BRE Status</th>
                  <th className="px-6 py-3 font-medium">Created Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <SkeletonRows />
                ) : (
                  leads.map((lead, i) => (
                    <tr
                      key={lead.id}
                      onClick={() => goToLead(lead.id)}
                      className={`border-b border-[var(--color-border)] last:border-0 cursor-pointer hover:bg-[var(--color-app-bg)] transition-colors duration-200 ${
                        i % 2 === 1 ? "bg-[var(--color-app-bg)]/40" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-[var(--color-muted)]">#{lead.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={lead.full_name} />
                          <div>
                            <p className="font-medium text-[var(--color-heading)]">{lead.full_name}</p>
                            <p className="text-xs text-[var(--color-muted)]">{lead.mobile_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <LoanTypeBadge type={lead.loan_type} />
                      </td>
                      <td className="px-6 py-4">
                        <CreditScoreCell score={lead.credit_score} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={lead.bre_status} />
                      </td>
                      <td className="px-6 py-4 text-[var(--color-muted)]">{formatDate(lead.created_at)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[var(--color-primary)] font-medium">
                          View <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="md:hidden divide-y divide-[var(--color-border)]">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 animate-pulse space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--color-app-bg)]" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-28 bg-[var(--color-app-bg)] rounded" />
                        <div className="h-3 w-20 bg-[var(--color-app-bg)] rounded" />
                      </div>
                    </div>
                    <div className="h-4 w-full bg-[var(--color-app-bg)] rounded" />
                  </div>
                ))
              : leads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => goToLead(lead.id)}
                    className="p-4 active:bg-[var(--color-app-bg)] transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={lead.full_name} />
                        <div>
                          <p className="font-medium text-[var(--color-heading)]">{lead.full_name}</p>
                          <p className="text-xs text-[var(--color-muted)]">{lead.mobile_number}</p>
                        </div>
                      </div>
                      <span className="text-xs text-[var(--color-muted)]">#{lead.id}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <LoanTypeBadge type={lead.loan_type} />
                      <StatusBadge status={lead.bre_status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <CreditScoreCell score={lead.credit_score} />
                      <span className="text-xs text-[var(--color-muted)]">{formatDate(lead.created_at)}</span>
                    </div>
                  </div>
                ))}
          </div>
        </>
      )}
    </div>
  );
}
