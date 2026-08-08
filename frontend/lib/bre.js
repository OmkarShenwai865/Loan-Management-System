export const FIELD_OPTIONS = [
  { value: "age", label: "Age" },
  { value: "monthly_income", label: "Monthly Income" },
  { value: "credit_score", label: "Credit Score" },
  { value: "loan_amount", label: "Loan Amount Required" },
  { value: "property_value", label: "Property Value" },
  { value: "employment_type", label: "Employment Type" },
  { value: "loan_type", label: "Loan Type" },
];

export const REFERENCE_FIELD_OPTIONS = [
  { value: "property_value", label: "Property Value" },
  { value: "monthly_income", label: "Monthly Income" },
  { value: "loan_amount", label: "Loan Amount Required" },
];

export const OPERATOR_OPTIONS = [
  { value: ">=", label: "≥  Greater than or equal to" },
  { value: "<=", label: "≤  Less than or equal to" },
  { value: ">", label: ">  Greater than" },
  { value: "<", label: "<  Less than" },
  { value: "==", label: "=  Equal to" },
  { value: "!=", label: "≠  Not equal to" },
];

const FIELD_LABEL_MAP = Object.fromEntries(FIELD_OPTIONS.map((f) => [f.value, f.label]));
// Shorter phrasing for the human-readable condition column (form dropdowns keep the fuller labels above).
const CONDITION_FIELD_LABEL_OVERRIDES = { loan_amount: "Loan Amount" };
const OPERATOR_SYMBOL_MAP = {
  ">=": "≥",
  "<=": "≤",
  ">": ">",
  "<": "<",
  "==": "=",
  "!=": "≠",
};

const ENUM_VALUE_LABELS = {
  SALARIED: "Salaried",
  SELF_EMPLOYED: "Self Employed",
  HOME_LOAN: "Home Loan",
  LAP: "Loan Against Property",
};

const CURRENCY_FIELDS = new Set(["monthly_income", "loan_amount", "property_value"]);

function formatINR(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);
}

/**
 * Renders a BusinessRule's condition in plain English, e.g.
 * "Credit Score ≥ 700" or "Loan Amount ≤ 80% Property Value".
 */
export function formatRuleCondition(rule) {
  const fieldLabel = CONDITION_FIELD_LABEL_OVERRIDES[rule.field_name] || FIELD_LABEL_MAP[rule.field_name] || rule.field_name;
  const symbol = OPERATOR_SYMBOL_MAP[rule.operator] || rule.operator;

  if (rule.comparison_type === "PERCENT_OF_FIELD") {
    const refLabel =
      CONDITION_FIELD_LABEL_OVERRIDES[rule.reference_field] ||
      FIELD_LABEL_MAP[rule.reference_field] ||
      rule.reference_field;
    const percent = Number(rule.percent_value);
    const percentDisplay = Number.isInteger(percent) ? percent : percent.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    return `${fieldLabel} ${symbol} ${percentDisplay}% ${refLabel}`;
  }

  let valueDisplay = rule.value;
  if (CURRENCY_FIELDS.has(rule.field_name)) {
    valueDisplay = formatINR(rule.value);
  } else if (ENUM_VALUE_LABELS[rule.value]) {
    valueDisplay = ENUM_VALUE_LABELS[rule.value];
  }

  return `${fieldLabel} ${symbol} ${valueDisplay}`;
}
