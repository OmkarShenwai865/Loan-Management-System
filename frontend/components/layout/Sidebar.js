"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, FileText, LayoutDashboard, ListChecks, LogOut, Users } from "lucide-react";
import { clearSession } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads/new", label: "Loan Applications", icon: FileText },
  { href: "/admin/leads", label: "Lead Management", icon: Users },
  { href: "/admin/bre-rules", label: "BRE Rules", icon: ListChecks },
  { href: null, label: "Analytics", icon: BarChart3, disabled: true },
];

function resolveActiveHref(pathname) {
  const matches = NAV_ITEMS.filter(
    (item) => item.href && !item.disabled && (pathname === item.href || pathname.startsWith(`${item.href}/`))
  );
  if (!matches.length) return null;
  return matches.sort((a, b) => b.href.length - a.href.length)[0].href;
}

export default function Sidebar({ open = false, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeHref = resolveActiveHref(pathname);

  function handleLogout() {
    clearSession();
    router.replace("/admin/login");
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 md:z-auto flex flex-col w-64 shrink-0 bg-[var(--color-sidebar)] text-gray-300 h-screen transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <span className="text-white font-semibold tracking-tight">MoneyBeing</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = item.href === activeHref;
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 rounded-xl pl-4 pr-3 py-2.5 text-sm font-medium text-gray-500 cursor-not-allowed"
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
                  {item.label}
                </span>
                <span className="text-[10px] uppercase tracking-wide bg-white/5 text-gray-500 rounded-full px-2 py-0.5">
                  Soon
                </span>
              </div>
            );
          }

          const linkProps = item.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

          return (
            <Link
              key={item.label}
              href={item.href}
              {...linkProps}
              onClick={onClose}
              className={`relative flex items-center gap-3 rounded-xl pl-4 pr-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                active
                  ? "bg-[var(--color-sidebar-active)] text-white"
                  : "text-gray-400 hover:bg-[var(--color-sidebar-active)]/60 hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-4 w-1 rounded-full bg-[var(--color-primary)]" />
              )}
              <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl pl-4 pr-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-[var(--color-sidebar-active)]/60 hover:text-white transition-colors duration-200"
        >
          <LogOut className="w-4.5 h-4.5" strokeWidth={1.75} />
          Logout
        </button>
      </div>
      </aside>
    </>
  );
}
