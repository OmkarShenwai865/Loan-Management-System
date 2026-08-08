const STYLES = {
  ELIGIBLE: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  NOT_ELIGIBLE: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
  PENDING: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
};

const LABELS = {
  ELIGIBLE: "Eligible",
  NOT_ELIGIBLE: "Rejected",
  PENDING: "Pending",
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || "bg-gray-100 text-gray-600";
  const label = LABELS[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
