"use client";

import { useMemo, useState } from "react";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, ClipboardList, Pencil, Search, Trash2 } from "lucide-react";
import { formatRuleCondition } from "@/lib/bre";

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        active ? "bg-[var(--color-success-soft)] text-[var(--color-success)]" : "bg-gray-100 text-gray-500"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="border-b border-[var(--color-border)] animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 w-32 bg-[var(--color-app-bg)] rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-40 bg-[var(--color-app-bg)] rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-10 bg-[var(--color-app-bg)] rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-16 bg-[var(--color-app-bg)] rounded-full" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-20 bg-[var(--color-app-bg)] rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-14 bg-[var(--color-app-bg)] rounded ml-auto" />
      </td>
    </tr>
  ));
}

export default function RulesTablePanel({ rules, loading, isSuperAdmin, onEdit, onDeleteRequest }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const visibleRules = useMemo(() => {
    let list = [...rules];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q));
    }
    if (status) {
      list = list.filter((r) => (status === "active" ? r.is_active : !r.is_active));
    }
    list.sort((a, b) => (sortDir === "asc" ? a.priority - b.priority : b.priority - a.priority));
    return list;
  }, [rules, search, status, sortDir]);

  const isEmpty = !loading && visibleRules.length === 0;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[var(--color-border)]">
        <h2 className="text-base font-semibold text-[var(--color-heading)]">Configured Rules</h2>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-[var(--color-border)]">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Rule Name..."
            className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-[var(--color-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors duration-150"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 px-3 rounded-xl border border-[var(--color-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors duration-150"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-body)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-150"
        >
          {sortDir === "asc" ? (
            <ArrowUpNarrowWide className="w-4 h-4" />
          ) : (
            <ArrowDownWideNarrow className="w-4 h-4" />
          )}
          Priority
        </button>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-app-bg)] flex items-center justify-center mb-4">
            <ClipboardList className="w-6 h-6 text-[var(--color-muted)]" strokeWidth={1.75} />
          </div>
          <h3 className="text-sm font-semibold text-[var(--color-heading)] mb-1.5">No Business Rules Found</h3>
          <p className="text-sm text-[var(--color-muted)] max-w-xs">
            Create your first Business Rule to begin evaluating loan applications.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-muted)] border-b border-[var(--color-border)]">
                <th className="px-6 py-3 font-medium">Rule Name</th>
                <th className="px-6 py-3 font-medium">Condition</th>
                <th className="px-6 py-3 font-medium">Priority</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Updated</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : (
                visibleRules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-app-bg)] transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-[var(--color-heading)]">{rule.name}</td>
                    <td className="px-6 py-4 text-[var(--color-body)]">{formatRuleCondition(rule)}</td>
                    <td className="px-6 py-4 text-[var(--color-muted)]">{rule.priority}</td>
                    <td className="px-6 py-4">
                      <StatusBadge active={rule.is_active} />
                    </td>
                    <td className="px-6 py-4 text-[var(--color-muted)]">{formatDate(rule.updated_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(rule)}
                          className="p-2 rounded-lg text-[var(--color-muted)] hover:bg-white hover:text-[var(--color-primary)] transition-colors duration-150"
                          aria-label={`Edit ${rule.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {isSuperAdmin && (
                          <button
                            onClick={() => onDeleteRequest(rule)}
                            className="p-2 rounded-lg text-[var(--color-muted)] hover:bg-white hover:text-[var(--color-danger)] transition-colors duration-150"
                            aria-label={`Delete ${rule.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
