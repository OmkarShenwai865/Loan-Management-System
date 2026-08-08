"use client";

import { Calendar, Download, Loader2, RotateCcw, Search } from "lucide-react";

const inputBase =
  "h-10 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-heading)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors duration-150";

export default function LeadsFilterBar({
  searchInput,
  onSearchChange,
  loanType,
  onLoanTypeChange,
  breStatus,
  onBreStatusChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onReset,
  onExport,
  exporting,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-4 sm:p-5 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none" />
          <input
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Lead ID, Customer Name or Mobile..."
            className={`${inputBase} w-full pl-10 pr-3.5`}
          />
        </div>

        <select
          value={loanType}
          onChange={(e) => onLoanTypeChange(e.target.value)}
          className={`${inputBase} px-3`}
        >
          <option value="">All Loan Types</option>
          <option value="HOME_LOAN">Home Loan</option>
          <option value="LAP">Loan Against Property</option>
        </select>

        <select
          value={breStatus}
          onChange={(e) => onBreStatusChange(e.target.value)}
          className={`${inputBase} px-3`}
        >
          <option value="">All BRE Statuses</option>
          <option value="ELIGIBLE">Eligible</option>
          <option value="NOT_ELIGIBLE">Not Eligible</option>
          <option value="PENDING">Pending</option>
        </select>

        <div className="flex items-center gap-1.5 border border-[var(--color-border)] rounded-xl px-3 h-10 bg-white">
          <Calendar className="w-4 h-4 text-[var(--color-muted)] shrink-0" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="text-sm text-[var(--color-heading)] bg-transparent focus:outline-none w-[110px]"
            aria-label="Date range from"
          />
          <span className="text-[var(--color-muted)]">–</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="text-sm text-[var(--color-heading)] bg-transparent focus:outline-none w-[110px]"
            aria-label="Date range to"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-body)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-150"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
          </button>

          <button
            onClick={onExport}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-60 transition-colors duration-150"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
