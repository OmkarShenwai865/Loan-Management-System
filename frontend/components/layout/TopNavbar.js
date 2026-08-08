"use client";

import { useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { getRole, getUsername } from "@/lib/auth";

function initialsOf(name) {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

export default function TopNavbar({ title, searchValue, onSearchChange, searchPlaceholder, onMenuClick }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const username = getUsername();
  const role = getRole();

  return (
    <header className="h-16 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--color-app-bg)] transition-colors duration-200"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-[var(--color-heading)]" />
        </button>
        <h1 className="text-base font-semibold text-[var(--color-heading)]">{title}</h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {onSearchChange && (
          <div className="hidden sm:flex items-center gap-2 bg-[var(--color-app-bg)] border border-[var(--color-border)] rounded-xl px-3 py-2 w-48 lg:w-64 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/30 transition-shadow">
            <Search className="w-4 h-4 text-[var(--color-muted)]" />
            <input
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder || "Search..."}
              className="bg-transparent text-sm outline-none w-full placeholder:text-[var(--color-muted)]"
            />
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-2 rounded-full hover:bg-[var(--color-app-bg)] transition-colors duration-200"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[var(--color-muted)]" strokeWidth={1.75} />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[var(--color-border)] rounded-xl shadow-lg p-4 text-sm text-[var(--color-muted)]">
              No new notifications
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 pl-3 border-l border-[var(--color-border)]">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold flex items-center justify-center">
            {initialsOf(username)}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-[var(--color-heading)]">{username}</p>
            <p className="text-xs text-[var(--color-muted)]">{role?.replace("_", " ")}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
