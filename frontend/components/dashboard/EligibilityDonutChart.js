"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-semibold text-[var(--color-heading)]">
        {item.name}: {item.value}
      </p>
    </div>
  );
}

export default function EligibilityDonutChart({ eligible = 0, rejected = 0 }) {
  const total = eligible + rejected;
  const approvalRate = total > 0 ? Math.round((eligible / total) * 100) : null;

  const data = useMemo(
    () => [
      { name: "Eligible", value: eligible, color: "var(--color-success)" },
      { name: "Rejected", value: rejected, color: "var(--color-danger)" },
    ],
    [eligible, rejected]
  );

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm h-full flex flex-col">
      <h2 className="text-sm font-semibold text-[var(--color-heading)]">Eligibility Distribution</h2>
      <p className="text-xs text-[var(--color-muted)] mt-0.5">Eligible vs rejected outcomes.</p>

      {total === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-muted)]">
          No decisioned leads yet
        </div>
      ) : (
        <>
          <div className="relative h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-semibold text-[var(--color-heading)]">{approvalRate}%</span>
              <span className="text-xs text-[var(--color-muted)]">Approval Rate</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4">
            {data.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[var(--color-body)]">{entry.name}</span>
                <span className="text-[var(--color-muted)]">({entry.value})</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
