"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { apiClient } from "@/lib/axiosClient";
import { getAccessToken } from "@/lib/auth";
import { computeTrend, computeWindowTotals } from "@/lib/dashboardMetrics";
import LeadsHeader from "@/components/leads/LeadsHeader";
import LeadsFilterBar from "@/components/leads/LeadsFilterBar";
import LeadsSummaryCards from "@/components/leads/LeadsSummaryCards";
import LeadsTable from "@/components/leads/LeadsTable";
import LeadsPagination from "@/components/leads/LeadsPagination";

export default function LeadsPage() {
  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loanType, setLoanType] = useState("");
  const [breStatus, setBreStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  // Table data
  const [data, setData] = useState(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState("");

  // Summary data (unfiltered, fetched once)
  const [summarySample, setSummarySample] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [pendingCount, setPendingCount] = useState(null);

  // Export
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  // Debounce the search box
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchTable = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (loanType) params.set("loan_type", loanType);
    if (breStatus) params.set("bre_status", breStatus);
    if (dateFrom) params.set("created_after", dateFrom);
    if (dateTo) params.set("created_before", dateTo);
    params.set("page", String(page));

    setTableLoading(true);
    setTableError("");
    apiFetch(`/leads/list/?${params.toString()}`, { auth: true })
      .then(setData)
      .catch((err) => setTableError(err.message || "Could not load leads."))
      .finally(() => setTableLoading(false));
  }, [search, loanType, breStatus, dateFrom, dateTo, page]);

  useEffect(() => {
    fetchTable();
  }, [fetchTable]);

  // Summary KPI data: fetched once, independent of table filters.
  useEffect(() => {
    apiFetch("/dashboard/stats/", { auth: true }).then(setDashboardStats).catch(() => {});
    apiFetch("/leads/list/?bre_status=PENDING&page_size=1", { auth: true })
      .then((res) => setPendingCount(res.count))
      .catch(() => {});
    apiFetch("/leads/list/?page_size=100&ordering=-created_at", { auth: true })
      .then((res) => setSummarySample(res.results || []))
      .catch(() => {});
  }, []);

  const totalTrend = useMemo(() => {
    const { current, previous } = computeWindowTotals(summarySample, 30);
    return computeTrend(current, previous, { moreIsGood: true });
  }, [summarySample]);

  const eligibleTrend = useMemo(() => {
    const { current, previous } = computeWindowTotals(summarySample.filter((l) => l.bre_status === "ELIGIBLE"), 30);
    return computeTrend(current, previous, { moreIsGood: true });
  }, [summarySample]);

  const rejectedTrend = useMemo(() => {
    const { current, previous } = computeWindowTotals(
      summarySample.filter((l) => l.bre_status === "NOT_ELIGIBLE"),
      30
    );
    return computeTrend(current, previous, { moreIsGood: false });
  }, [summarySample]);

  const pendingTrend = useMemo(() => {
    const { current, previous } = computeWindowTotals(summarySample.filter((l) => l.bre_status === "PENDING"), 30);
    return computeTrend(current, previous, { moreIsGood: false });
  }, [summarySample]);

  function handleReset() {
    setSearchInput("");
    setSearch("");
    setLoanType("");
    setBreStatus("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  async function handleExport() {
    setExporting(true);
    setExportError("");
    try {
      const token = getAccessToken();
      const response = await apiClient.get("/leads/export/", {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "leads.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError("Could not export leads right now. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <LeadsHeader />

      <LeadsSummaryCards
        totalLeads={dashboardStats?.total_leads ?? "—"}
        eligibleLeads={dashboardStats?.eligible_leads ?? "—"}
        rejectedLeads={dashboardStats?.rejected_leads ?? "—"}
        pendingLeads={pendingCount ?? "—"}
        totalTrend={totalTrend}
        eligibleTrend={eligibleTrend}
        rejectedTrend={rejectedTrend}
        pendingTrend={pendingTrend}
      />

      <LeadsFilterBar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        loanType={loanType}
        onLoanTypeChange={(v) => {
          setLoanType(v);
          setPage(1);
        }}
        breStatus={breStatus}
        onBreStatusChange={(v) => {
          setBreStatus(v);
          setPage(1);
        }}
        dateFrom={dateFrom}
        onDateFromChange={(v) => {
          setDateFrom(v);
          setPage(1);
        }}
        dateTo={dateTo}
        onDateToChange={(v) => {
          setDateTo(v);
          setPage(1);
        }}
        onReset={handleReset}
        onExport={handleExport}
        exporting={exporting}
      />

      {exportError && <p className="text-sm text-[var(--color-danger)] mb-4">{exportError}</p>}

      {tableError ? (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-danger-soft)] flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-5 h-5 text-[var(--color-danger)]" strokeWidth={1.75} />
          </div>
          <h3 className="text-sm font-semibold text-[var(--color-heading)] mb-1.5">Could Not Load Leads</h3>
          <p className="text-sm text-[var(--color-muted)] mb-5">{tableError}</p>
          <button
            onClick={fetchTable}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-150"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      ) : (
        <>
          <LeadsTable leads={data?.results || []} loading={tableLoading} onReset={handleReset} />
          <LeadsPagination
            currentPage={data?.current_page || 1}
            totalPages={data?.total_pages || 1}
            totalCount={data?.count || 0}
            hasNext={!!data?.next}
            hasPrevious={!!data?.previous}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
