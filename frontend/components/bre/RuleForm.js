import { FIELD_OPTIONS, OPERATOR_OPTIONS, REFERENCE_FIELD_OPTIONS } from "@/lib/bre";
import TextField from "@/components/forms/TextField";
import SelectField from "@/components/forms/SelectField";
import Toggle from "@/components/forms/Toggle";

const COMPARISON_OPTIONS = [
  { value: "ABSOLUTE", label: "Absolute Value" },
  { value: "PERCENT_OF_FIELD", label: "Percentage of Another Field" },
];

export default function RuleForm({ register, errors, watch, disabled }) {
  const comparisonType = watch("comparison_type");
  const rejectionReason = watch("rejection_reason") || "";

  return (
    <div className="space-y-5">
      <TextField
        label="Rule Name"
        placeholder="e.g. Minimum Credit Score"
        helper="Example: Minimum Credit Score"
        disabled={disabled}
        error={errors.name?.message}
        {...register("name")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SelectField
          label="Field"
          options={FIELD_OPTIONS}
          disabled={disabled}
          error={errors.field_name?.message}
          {...register("field_name")}
        />
        <SelectField
          label="Operator"
          options={OPERATOR_OPTIONS}
          disabled={disabled}
          error={errors.operator?.message}
          {...register("operator")}
        />
      </div>

      <SelectField
        label="Comparison Type"
        options={COMPARISON_OPTIONS}
        disabled={disabled}
        error={errors.comparison_type?.message}
        helper={
          comparisonType === "ABSOLUTE"
            ? "Absolute Value compares directly against a fixed threshold."
            : "Percentage of Another Field compares against a computed percentage of a second field."
        }
        {...register("comparison_type")}
      />

      {comparisonType === "ABSOLUTE" ? (
        <TextField
          label="Value"
          placeholder="e.g. 700"
          disabled={disabled}
          error={errors.value?.message}
          {...register("value")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextField
            label="Percent (%)"
            type="number"
            placeholder="e.g. 80"
            disabled={disabled}
            error={errors.percent_value?.message}
            {...register("percent_value")}
          />
          <SelectField
            label="Of Field"
            options={REFERENCE_FIELD_OPTIONS}
            disabled={disabled}
            error={errors.reference_field?.message}
            {...register("reference_field")}
          />
        </div>
      )}

      <TextField
        label="Execution Priority"
        type="number"
        helper="Lower values are evaluated first."
        disabled={disabled}
        error={errors.priority?.message}
        {...register("priority")}
      />

      <div>
        <label htmlFor="rejection_reason" className="block text-sm font-medium text-[var(--color-body)] mb-1.5">
          Rejection Reason
        </label>
        <textarea
          id="rejection_reason"
          rows={3}
          maxLength={255}
          disabled={disabled}
          placeholder="Message shown to the applicant if this rule fails"
          aria-invalid={!!errors.rejection_reason}
          className={`w-full rounded-xl border bg-white text-sm text-[var(--color-heading)] placeholder:text-[var(--color-muted)] p-3.5 resize-none transition-colors duration-150 focus:outline-none focus:ring-2 disabled:bg-[var(--color-app-bg)] disabled:cursor-not-allowed ${
            errors.rejection_reason
              ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20"
              : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
          }`}
          {...register("rejection_reason")}
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-[var(--color-danger)]">{errors.rejection_reason?.message}</span>
          <span className="text-xs text-[var(--color-muted)] shrink-0">{rejectionReason.length}/255</span>
        </div>
      </div>

      <Toggle
        label="Active"
        description="Inactive rules are skipped during eligibility evaluation."
        disabled={disabled}
        {...register("is_active")}
      />
    </div>
  );
}
