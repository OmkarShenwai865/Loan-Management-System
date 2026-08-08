import { z } from "zod";

export const loanApplicationSchema = z.object({
  full_name: z.string().trim().min(2, "Enter the applicant's full name"),
  mobile_number: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().email("Enter a valid email address"),
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => new Date(val).getTime() < Date.now(), "Date of birth must be in the past"),
  city: z.string().trim().min(2, "City is required"),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  loan_type: z.enum(["HOME_LOAN", "LAP"]),
  employment_type: z.enum(["SALARIED", "SELF_EMPLOYED"]),
  monthly_income: z.coerce
    .number({ invalid_type_error: "Enter the monthly income" })
    .positive("Monthly income must be greater than zero"),
  loan_amount_required: z.coerce
    .number({ invalid_type_error: "Enter the loan amount required" })
    .positive("Loan amount must be greater than zero"),
  property_value: z.coerce
    .number({ invalid_type_error: "Enter the property value" })
    .positive("Property value must be greater than zero"),
  consent_given: z
    .boolean()
    .refine((val) => val === true, {
      message: "Consent to share information with lending partners is mandatory.",
    }),
});

export const loanApplicationDefaults = {
  full_name: "",
  mobile_number: "",
  email: "",
  date_of_birth: "",
  city: "",
  pincode: "",
  loan_type: "HOME_LOAN",
  employment_type: "SALARIED",
  monthly_income: "",
  loan_amount_required: "",
  property_value: "",
  consent_given: false,
};
