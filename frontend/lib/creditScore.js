export function categorizeCreditScore(score) {
  if (score === null || score === undefined || Number.isNaN(score)) return "No Data";
  if (score >= 750) return "Excellent";
  if (score >= 700) return "Good";
  if (score >= 650) return "Average";
  return "Poor";
}

export const CREDIT_SCORE_TONE = {
  Excellent: { badge: "bg-[var(--color-success-soft)] text-[var(--color-success)]", dot: "var(--color-success)" },
  Good: { badge: "bg-blue-100 text-blue-700", dot: "#2563eb" },
  Average: { badge: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]", dot: "var(--color-warning)" },
  Poor: { badge: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]", dot: "var(--color-danger)" },
  "No Data": { badge: "bg-gray-100 text-gray-500", dot: "#9ca3af" },
};

export function creditScoreTone(score) {
  return CREDIT_SCORE_TONE[categorizeCreditScore(score)];
}
