"use client";

import { useEffect, useMemo, useState } from "react";
import { Gauge, ShieldCheck, ShieldX, Users } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAdminSearch } from "@/components/layout/AdminShellContext";
import KpiCard from "@/components/ui/KpiCard";
import DailyApplicationsChart from "@/components/dashboard/DailyApplicationsChart";
import EligibilityDonutChart from "@/components/dashboard/EligibilityDonutChart";
import RecentApplicationsTable from "@/components/dashboard/RecentApplicationsTable";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";
import { computeTrend, computeWindowAverageScore, computeWindowTotals } from "@/lib/dashboardMetrics";
import { categorizeCreditScore } from "@/lib/creditScore";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { search } = useAdminSearch();

  useEffect(() => {
    Promise.all([
      apiFetch("/dashboard/stats/", { auth: true }),
      apiFetch("/leads/list/?page_size=100&ordering=-created_at", { auth: true }),
    ])
      .then(([statsRes, leadsRes]) => {
        setStats(statsRes);
        setLeads(leadsRes.results || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalTrend = useMemo(() => {
    const { current, previous } = computeWindowTotals(leads, 30);
    return computeTrend(current, previous, { moreIsGood: true });
  }, [leads]);

  const eligibleTrend = useMemo(() => {
    const { current, previous } = computeWindowTotals(
      leads.filter((l) => l.bre_status === "ELIGIBLE"),
      30
    );
    return computeTrend(current, previous, { moreIsGood: true });
  }, [leads]);

  const rejectedTrend = useMemo(() => {
    const { current, previous } = computeWindowTotals(
      leads.filter((l) => l.bre_status === "NOT_ELIGIBLE"),
      30
    );
    return computeTrend(current, previous, { moreIsGood: false });
  }, [leads]);

  const scoreTrend = useMemo(() => {
    const { current, previous } = computeWindowAverageScore(leads, 30);
    return computeTrend(current, previous, { moreIsGood: true });
  }, [leads]);

  const filteredLeads = useMemo(() => {
    if (!search) return leads;
    const q = search.toLowerCase();
    return leads.filter(
      (l) => l.full_name.toLowerCase().includes(q) || l.mobile_number.includes(q)
    );
  }, [leads, search]);

  const recentLeads = filteredLeads.slice(0, 8);

  if (error) {
    return <p className="text-[var(--color-danger)]">{error}</p>;
  }

  if (loading) {
    return <p className="text-[var(--color-muted)]">Loading dashboard...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-heading)] tracking-tight">Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Monitor today&apos;s loan portfolio and application activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          icon={Users}
          iconClassName="text-slate-500"
          label="Total Leads"
          value={stats.total_leads}
          trend={totalTrend}
        />
        <KpiCard
          icon={ShieldCheck}
          iconClassName="text-[var(--color-success)]"
          label="Eligible Leads"
          value={stats.eligible_leads}
          trend={eligibleTrend}
        />
        <KpiCard
          icon={ShieldX}
          iconClassName="text-[var(--color-danger)]"
          label="Rejected Leads"
          value={stats.rejected_leads}
          trend={rejectedTrend}
        />
        <KpiCard
          icon={Gauge}
          iconClassName="text-[var(--color-warning)]"
          label="Average Credit Score"
          value={stats.average_credit_score || "N/A"}
          trend={
            scoreTrend || {
              direction: null,
              tone: "neutral",
              text: categorizeCreditScore(stats.average_credit_score),
            }
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <DailyApplicationsChart leads={leads} />
        </div>
        <div>
          <EligibilityDonutChart eligible={stats.eligible_leads} rejected={stats.rejected_leads} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentApplicationsTable leads={recentLeads} />
        </div>
        <div>
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}
