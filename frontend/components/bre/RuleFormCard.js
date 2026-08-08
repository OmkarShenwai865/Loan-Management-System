"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { businessRuleDefaults, businessRuleSchema, formValuesToPayload } from "@/lib/schemas/businessRuleSchema";
import RuleForm from "./RuleForm";

export default function RuleFormCard({ onCreated, onError }) {
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

  async function onSubmit(data) {
    try {
      const payload = formValuesToPayload(data);
      const rule = await apiFetch("/bre/rules/", { method: "POST", body: payload, auth: true });
      reset(businessRuleDefaults);
      onCreated(rule);
    } catch (err) {
      onError(err.message || "Could not save rule.");
    }
  }

  return (
    <div
      id="rule-form-card"
      className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 sm:p-8"
    >
      <h2 className="text-base font-semibold text-[var(--color-heading)] mb-6">Rule Configuration</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <RuleForm register={register} errors={errors} watch={watch} disabled={isSubmitting} />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-[52px] rounded-xl bg-[var(--color-primary)] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-primary-hover)] disabled:opacity-60 transition-colors duration-200"
          >
            {isSubmitting && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
            Save Rule
          </button>
          <button
            type="button"
            onClick={() => reset(businessRuleDefaults)}
            className="h-[52px] px-5 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-body)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-200"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}
