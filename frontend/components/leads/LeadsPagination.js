import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  return Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
}

export default function LeadsPagination({ currentPage, totalPages, totalCount, hasNext, hasPrevious, onPageChange }) {
  if (!totalPages || totalPages <= 1) {
    return (
      <div className="flex items-center justify-between mt-4 text-sm text-[var(--color-muted)]">
        <span>{totalCount} total</span>
      </div>
    );
  }

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
      <span className="text-sm text-[var(--color-muted)]">
        Page {currentPage} of {totalPages} &middot; {totalCount} total
      </span>

      <div className="flex items-center gap-1.5">
        <button
          disabled={!hasPrevious}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-body)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-150"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((page, i) => {
          const prev = pages[i - 1];
          const showEllipsis = prev !== undefined && page - prev > 1;
          return (
            <span key={page} className="flex items-center gap-1.5">
              {showEllipsis && <span className="text-[var(--color-muted)] px-1">&hellip;</span>}
              <button
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  page === currentPage
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-body)] hover:bg-[var(--color-app-bg)]"
                }`}
              >
                {page}
              </button>
            </span>
          );
        })}

        <button
          disabled={!hasNext}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-body)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-150"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
