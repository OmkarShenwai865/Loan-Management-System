import { categorizeCreditScore, creditScoreTone } from "@/lib/creditScore";

export default function CreditScoreCell({ score }) {
  if (score === null || score === undefined) {
    return <span className="text-sm text-[var(--color-muted)]">N/A</span>;
  }

  const grade = categorizeCreditScore(score);
  const tone = creditScoreTone(score);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-[var(--color-heading)]">{score}</span>
      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${tone.badge}`}>{grade}</span>
    </div>
  );
}
