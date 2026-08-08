import Link from "next/link";
import { ListChecks, Plus, Users } from "lucide-react";

const ACTIONS = [
  { href: "/admin/leads/new", label: "New Loan Application", icon: Plus },
  { href: "/admin/bre-rules", label: "Manage BRE Rules", icon: ListChecks },
  { href: "/admin/leads", label: "View All Leads", icon: Users },
];

export default function QuickActionsCard() {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-[var(--color-heading)] mb-4">Quick Actions</h2>
      <div className="flex flex-col gap-2.5">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          const linkProps = action.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
          return (
            <Link
              key={action.label}
              href={action.href}
              {...linkProps}
              className="flex items-center gap-2.5 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--color-body)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              <Icon className="w-4 h-4" strokeWidth={1.75} />
              {action.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
