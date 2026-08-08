import { creditScoreTone } from "@/lib/creditScore";

export default function CreditScoreBadge({ score }) {
  const tone = creditScoreTone(score);
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${tone.badge}`}>
      {score ?? "N/A"}
    </span>
  );
}
