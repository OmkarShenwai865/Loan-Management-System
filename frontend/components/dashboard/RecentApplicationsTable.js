import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import CreditScoreBadge from "@/components/ui/CreditScoreBadge";

const LOAN_TYPE_LABELS = {
  HOME_LOAN: "Home Loan",
  LAP: "Loan Against Property",
};

export default function RecentApplicationsTable({ leads }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[var(--color-border)]">
        <h2 className="text-sm font-semibold text-[var(--color-heading)]">Recent Loan Applications</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--color-muted)] border-b border-[var(--color-border)]">
              <th className="px-6 py-3 font-medium">Lead ID</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Loan Type</th>
              <th className="px-6 py-3 font-medium">Credit Score</th>
              <th className="px-6 py-3 font-medium">BRE Status</th>
              <th className="px-6 py-3 font-medium">Created Date</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-[var(--color-muted)]">
                  No applications match your search.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-app-bg)] transition-colors duration-200"
              >
                <td className="px-6 py-3.5 text-[var(--color-muted)]">#{lead.id}</td>
                <td className="px-6 py-3.5 font-medium text-[var(--color-heading)]">{lead.full_name}</td>
                <td className="px-6 py-3.5 text-[var(--color-body)]">
                  {LOAN_TYPE_LABELS[lead.loan_type] || lead.loan_type}
                </td>
                <td className="px-6 py-3.5">
                  <CreditScoreBadge score={lead.credit_score} />
                </td>
                <td className="px-6 py-3.5">
                  <StatusBadge status={lead.bre_status} />
                </td>
                <td className="px-6 py-3.5 text-[var(--color-muted)]">
                  {new Date(lead.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-3.5 text-right">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="inline-flex items-center gap-1 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm"
                  >
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
