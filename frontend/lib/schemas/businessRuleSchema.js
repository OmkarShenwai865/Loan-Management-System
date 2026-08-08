import { z } from "zod";

export const businessRuleSchema = z
  .object({
    name: z.string().trim().min(2, "Enter a descriptive rule name"),
    field_name: z.enum([
      "age",
      "monthly_income",
      "credit_score",
      "loan_amount",
      "property_value",
      "employment_type",
      "loan_type",
    ]),
    operator: z.enum([">=", "<=", ">", "<", "==", "!="]),
    comparison_type: z.enum(["ABSOLUTE", "PERCENT_OF_FIELD"]),
    value: z.string().optional(),
    percent_value: z.union([z.string(), z.number()]).optional(),
    reference_field: z.string().optional(),
    priority: z.coerce.number().int("Must be a whole number").min(0, "Priority must be zero or greater"),
    rejection_reason: z
      .string()
      .trim()
      .min(1, "Rejection reason is required")
      .max(255, "Keep it under 255 characters"),
    is_active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.comparison_type === "ABSOLUTE") {
      if (!data.value || !String(data.value).trim()) {
        ctx.addIssue({ path: ["value"], code: z.ZodIssueCode.custom, message: "Value is required" });
      }
    } else {
      if (data.percent_value === undefined || data.percent_value === "" || Number.isNaN(Number(data.percent_value))) {
        ctx.addIssue({ path: ["percent_value"], code: z.ZodIssueCode.custom, message: "Percentage is required" });
      }
      if (!data.reference_field) {
        ctx.addIssue({ path: ["reference_field"], code: z.ZodIssueCode.custom, message: "Reference field is required" });
      }
    }
  });

export const businessRuleDefaults = {
  name: "",
  field_name: "age",
  operator: ">=",
  comparison_type: "ABSOLUTE",
  value: "",
  percent_value: "",
  reference_field: "property_value",
  priority: 0,
  rejection_reason: "",
  is_active: true,
};

export function ruleToFormValues(rule) {
  return {
    name: rule.name,
    field_name: rule.field_name,
    operator: rule.operator,
    comparison_type: rule.comparison_type,
    value: rule.value ?? "",
    percent_value: rule.percent_value ?? "",
    reference_field: rule.reference_field ?? "property_value",
    priority: rule.priority,
    rejection_reason: rule.rejection_reason,
    is_active: rule.is_active,
  };
}

export function formValuesToPayload(data) {
  return {
    name: data.name,
    field_name: data.field_name,
    operator: data.operator,
    comparison_type: data.comparison_type,
    priority: Number(data.priority) || 0,
    rejection_reason: data.rejection_reason,
    is_active: data.is_active,
    value: data.comparison_type === "ABSOLUTE" ? data.value : null,
    percent_value: data.comparison_type === "PERCENT_OF_FIELD" ? Number(data.percent_value) : null,
    reference_field: data.comparison_type === "PERCENT_OF_FIELD" ? data.reference_field : null,
  };
}
