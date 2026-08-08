import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";

export default function BreHeader({ onAddNew }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-heading)] tracking-tight">
          Business Rule Engine
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1.5">
          Configure and manage loan eligibility rules used during customer evaluation.
        </p>
      </div>
      <div className="flex flex-col items-end gap-3 shrink-0">
        <nav className="flex items-center gap-1.5 text-sm">
          <Link href="/admin/dashboard" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--color-muted)]" />
          <span className="text-[var(--color-heading)] font-medium">BRE Rules</span>
        </nav>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors duration-150"
        >
          <Plus className="w-4 h-4" />
          Add New Rule
        </button>
      </div>
    </div>
  );
}
