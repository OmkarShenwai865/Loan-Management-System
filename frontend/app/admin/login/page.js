"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Landmark, Loader2, Lock, User } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { setSession } from "@/lib/auth";

const CAPABILITIES = [
  "Credit Bureau Integration",
  "Dynamic Business Rule Engine",
  "Centralized Lead Management",
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await apiFetch("/auth/login/", {
        method: "POST",
        body: { username, password },
      });
      setSession({ access: data.access, refresh: data.refresh, role: data.role, username: data.username });
      router.replace("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left: login */}
      <div className="w-full md:w-1/2 lg:w-[42%] h-full overflow-y-auto flex items-center justify-center bg-white px-6 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
              <Landmark className="w-4.5 h-4.5 text-[var(--color-primary)]" strokeWidth={1.75} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-[var(--color-heading)]">Loan Management</p>
              <p className="text-xs text-[var(--color-muted)]">Loan Eligibility Platform</p>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-[var(--color-heading)] tracking-tight">Admin Login</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1.5 mb-6">
            Sign in to access the Loan Eligibility &amp; Lead Management Console.
          </p>

          {error && (
            <div className="mb-5 rounded-xl bg-[var(--color-danger-soft)] text-[var(--color-danger)] text-sm px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[var(--color-body)] mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none" />
                <input
                  id="username"
                  required
                  autoFocus
                  placeholder="Enter your username"
                  disabled={submitting}
                  className="w-full h-12 rounded-xl border border-[var(--color-border)] bg-white pl-10 pr-3.5 text-sm text-[var(--color-heading)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] disabled:bg-[var(--color-app-bg)] transition-colors duration-150"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-body)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  disabled={submitting}
                  className="w-full h-12 rounded-xl border border-[var(--color-border)] bg-white pl-10 pr-11 text-sm text-[var(--color-heading)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] disabled:bg-[var(--color-app-bg)] transition-colors duration-150"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-heading)] transition-colors duration-150"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[52px] rounded-xl bg-[var(--color-primary)] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-1.5 mt-4 text-xs text-[var(--color-muted)]">
            <Lock className="w-3.5 h-3.5" strokeWidth={1.75} />
            Secure Admin Access
          </div>
        </div>
      </div>

      {/* Right: product introduction */}
      <div className="hidden md:flex md:w-1/2 lg:w-[58%] h-full overflow-y-auto bg-[var(--color-app-bg)] items-center justify-center px-10 lg:px-16">
        <div className="max-w-md w-full">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-2">
            Loan Eligibility Platform
          </p>
          <h2 className="text-2xl lg:text-3xl font-semibold text-[var(--color-heading)] tracking-tight">
            Loan Eligibility &<br />Lead Management
          </h2>
          <p className="text-[var(--color-muted)] text-sm mt-3 max-w-sm">
            Evaluate loan applications, assess credit eligibility, and manage lending leads
            from one secure workspace.
          </p>

          <ul className="mt-5 space-y-2">
            {CAPABILITIES.map((cap) => (
              <li key={cap} className="flex items-center gap-2.5 text-sm text-[var(--color-body)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0" strokeWidth={1.75} />
                {cap}
              </li>
            ))}
          </ul>

          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden mt-6">
            <div className="px-5 py-3.5 border-b border-[var(--color-border)]">
              <h3 className="text-sm font-semibold text-[var(--color-heading)]">Eligibility Overview</h3>
            </div>
            <div className="p-5 space-y-3.5">
              <div>
                <p className="text-xs text-[var(--color-muted)] mb-1">Credit Score</p>
                <p className="text-3xl font-bold text-[var(--color-heading)] tracking-tight">742</p>
              </div>
              <div className="flex items-center gap-2 bg-[var(--color-success-soft)] text-[var(--color-success)] rounded-lg px-3 py-2 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
                Eligible
              </div>
              <div>
                <p className="text-xs text-[var(--color-muted)] mb-1">BRE Evaluation</p>
                <p className="text-sm text-[var(--color-body)]">All configured rules passed</p>
              </div>
            </div>
            <div className="px-5 py-2 bg-[var(--color-app-bg)] text-center">
              <span className="text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
                Sample preview
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
