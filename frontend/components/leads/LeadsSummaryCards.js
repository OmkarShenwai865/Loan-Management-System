import { Clock, ShieldCheck, ShieldX, Users } from "lucide-react";
import KpiCard from "@/components/ui/KpiCard";

export default function LeadsSummaryCards({
  totalLeads,
  eligibleLeads,
  rejectedLeads,
  pendingLeads,
  totalTrend,
  eligibleTrend,
  rejectedTrend,
  pendingTrend,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KpiCard icon={Users} iconClassName="text-slate-500" label="Total Leads" value={totalLeads} trend={totalTrend} />
      <KpiCard
        icon={ShieldCheck}
        iconClassName="text-[var(--color-success)]"
        label="Eligible"
        value={eligibleLeads}
        trend={eligibleTrend}
      />
      <KpiCard
        icon={ShieldX}
        iconClassName="text-[var(--color-danger)]"
        label="Rejected"
        value={rejectedLeads}
        trend={rejectedTrend}
      />
      <KpiCard
        icon={Clock}
        iconClassName="text-[var(--color-warning)]"
        label="Pending"
        value={pendingLeads}
        trend={pendingTrend}
      />
    </div>
  );
}
