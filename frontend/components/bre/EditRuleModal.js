"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  businessRuleDefaults,
  businessRuleSchema,
  formValuesToPayload,
  ruleToFormValues,
} from "@/lib/schemas/businessRuleSchema";
import Modal from "@/components/ui/Modal";
import RuleForm from "./RuleForm";

export default function EditRuleModal({ open, rule, onClose, onUpdated, onError }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(businessRuleSchema),
    defaultValues: businessRuleDefaults,
    mode: "onTouched",
  });

  useEffect(() => {
    if (rule) reset(ruleToFormValues(rule));
  }, [rule, reset]);

  async function onSubmit(data) {
    try {
      const payload = formValuesToPayload(data);
      const updated = await apiFetch(`/bre/rules/${rule.id}/`, { method: "PATCH", body: payload, auth: true });
      onUpdated(updated);
    } catch (err) {
      onError(err.message || "Could not update rule.");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={rule ? `Edit Rule: ${rule.name}` : "Edit Rule"} maxWidth="max-w-xl">
      {rule && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <RuleForm register={register} errors={errors} watch={watch} disabled={isSubmitting} />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-[52px] rounded-xl bg-[var(--color-primary)] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-primary-hover)] disabled:opacity-60 transition-colors duration-200"
            >
              {isSubmitting && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-[52px] px-5 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-body)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
