import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-heading)] tracking-tight">
          New Loan Application
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1.5 max-w-xl">
          Create a customer application and instantly evaluate loan eligibility using Credit Bureau
          and Business Rule Engine.
        </p>
      </div>

      <nav className="flex items-center gap-1.5 text-sm shrink-0 pt-1">
        <Link href="/admin/dashboard" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--color-muted)]" />
        <span className="text-[var(--color-muted)]">Loan Applications</span>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--color-muted)]" />
        <span className="text-[var(--color-heading)] font-medium">New Application</span>
      </nav>
    </div>
  );
}
