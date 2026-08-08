"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { computeDailyCounts, computeTrend, computeWindowTotals } from "@/lib/dashboardMetrics";

const RANGE_OPTIONS = [
  { value: 7, label: "Last 7 Days" },
  { value: 30, label: "Last 30 Days" },
  { value: 90, label: "Last 90 Days" },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="text-[var(--color-muted)] mb-0.5">{label}</p>
      <p className="font-semibold text-[var(--color-heading)]">{payload[0].value} applications</p>
    </div>
  );
}

export default function DailyApplicationsChart({ leads }) {
  const [rangeDays, setRangeDays] = useState(30);

  const data = useMemo(() => computeDailyCounts(leads, rangeDays), [leads, rangeDays]);

  const trend = useMemo(() => {
    const { current, previous } = computeWindowTotals(leads, 30);
    return computeTrend(current, previous, { moreIsGood: true, label: "vs last month" });
  }, [leads]);

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm h-full">
      <div className="flex items-start justify-between mb-1 gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-heading)]">Daily Loan Applications</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Applications received over the last {rangeDays} days.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {trend && (
            <span
              className={`hidden sm:flex items-center gap-1 text-xs font-medium ${
                trend.tone === "positive"
                  ? "text-[var(--color-success)]"
                  : trend.tone === "negative"
                  ? "text-[var(--color-danger)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              {trend.direction === "up" ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {trend.text}
            </span>
          )}
          <select
            value={rangeDays}
            onChange={(e) => setRangeDays(Number(e.target.value))}
            className="text-xs border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-[var(--color-body)] bg-white"
          >
            {RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--color-muted)" }}
              axisLine={false}
              tickLine={false}
              interval={Math.ceil(data.length / 8)}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--color-muted)" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={32}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="var(--color-primary)"
              fillOpacity={0.08}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
