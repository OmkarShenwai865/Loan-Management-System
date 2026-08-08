import { Briefcase, Building2, IndianRupee, Landmark } from "lucide-react";
import SelectField from "@/components/forms/SelectField";
import CurrencyField from "@/components/forms/CurrencyField";

const LOAN_TYPE_OPTIONS = [
  { value: "HOME_LOAN", label: "Home Loan" },
  { value: "LAP", label: "Loan Against Property (LAP)" },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "SALARIED", label: "Salaried" },
  { value: "SELF_EMPLOYED", label: "Self Employed" },
];

export default function LoanDetailsCard({ register, control, errors, disabled }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 sm:p-8">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
          <Landmark className="w-4.5 h-4.5 text-[var(--color-primary)]" strokeWidth={1.75} />
        </div>
        <h2 className="text-base font-semibold text-[var(--color-heading)]">Loan Details</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SelectField
          label="Loan Type"
          icon={Building2}
          options={LOAN_TYPE_OPTIONS}
          disabled={disabled}
          error={errors.loan_type?.message}
          {...register("loan_type")}
        />
        <SelectField
          label="Employment Type"
          icon={Briefcase}
          options={EMPLOYMENT_TYPE_OPTIONS}
          disabled={disabled}
          error={errors.employment_type?.message}
          {...register("employment_type")}
        />
        <CurrencyField
          label="Monthly Income (₹)"
          icon={IndianRupee}
          placeholder="e.g. 55,000"
          control={control}
          name="monthly_income"
          error={errors.monthly_income?.message}
          disabled={disabled}
        />
        <CurrencyField
          label="Loan Amount Required (₹)"
          icon={IndianRupee}
          placeholder="e.g. 20,00,000"
          control={control}
          name="loan_amount_required"
          error={errors.loan_amount_required?.message}
          disabled={disabled}
        />
        <CurrencyField
          label="Property Value (₹)"
          icon={IndianRupee}
          placeholder="e.g. 30,00,000"
          control={control}
          name="property_value"
          error={errors.property_value?.message}
          disabled={disabled}
          className="sm:col-span-2"
        />
      </div>
    </div>
  );
}
