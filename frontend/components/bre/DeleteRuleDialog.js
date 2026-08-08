"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";

export default function DeleteRuleDialog({ open, rule, onClose, onConfirm, deleting }) {
  return (
    <Modal open={open} onClose={onClose} title="Delete Business Rule?" maxWidth="max-w-md">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-danger-soft)] flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-[var(--color-danger)]" strokeWidth={1.75} />
        </div>
        <p className="text-sm text-[var(--color-body)] leading-relaxed pt-1.5">
          Deleting <span className="font-medium text-[var(--color-heading)]">{rule?.name}</span> will
          immediately affect future loan eligibility evaluations. This action cannot be undone.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 h-11 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-body)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-150"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 h-11 rounded-xl bg-[var(--color-danger)] text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-60 transition-colors duration-150"
        >
          {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
          Delete Rule
        </button>
      </div>
    </Modal>
  );
}
