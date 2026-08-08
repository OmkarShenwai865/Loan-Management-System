"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import TopNavbar from "@/components/layout/TopNavbar";
import { AdminShellContext } from "@/components/layout/AdminShellContext";

const PAGE_TITLES = [
  { prefix: "/admin/dashboard", title: "Dashboard" },
  { prefix: "/admin/leads/new", title: "New Application" },
  { prefix: "/admin/leads", title: "Lead Management" },
  { prefix: "/admin/bre-rules", title: "BRE Rules" },
];

function titleFor(pathname) {
  return PAGE_TITLES.find((p) => pathname.startsWith(p.prefix))?.title || "Admin";
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";
  const isDashboard = pathname.startsWith("/admin/dashboard");

  useEffect(() => {
    if (!isLoginPage && !isAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!ready) {
    return <div className="flex-1 flex items-center justify-center text-[var(--color-muted)]">Loading...</div>;
  }

  return (
    <AdminShellContext.Provider value={{ search, setSearch }}>
      <div className="flex-1 flex min-h-screen bg-[var(--color-app-bg)]">
        <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNavbar
            title={titleFor(pathname)}
            searchValue={isDashboard ? search : undefined}
            onSearchChange={isDashboard ? setSearch : undefined}
            searchPlaceholder="Search recent applications..."
            onMenuClick={() => setMobileNavOpen(true)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminShellContext.Provider>
  );
}
