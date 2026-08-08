import operator as py_operator
from dataclasses import dataclass, field
from decimal import Decimal, InvalidOperation

from django.utils import timezone

from apps.bre.models import BusinessRule, RuleEvaluationLog

NUMERIC_FIELDS = {"age", "monthly_income", "credit_score", "loan_amount", "property_value"}
STRING_FIELDS = {"employment_type", "loan_type"}

OPERATOR_FUNCS = {
    ">=": py_operator.ge,
    "<=": py_operator.le,
    ">": py_operator.gt,
    "<": py_operator.lt,
    "==": py_operator.eq,
    "!=": py_operator.ne,
}


def _calculate_age(date_of_birth) -> int:
    today = timezone.now().date()
    years = today.year - date_of_birth.year
    if (today.month, today.day) < (date_of_birth.month, date_of_birth.day):
        years -= 1
    return years


def build_context(lead, credit_score) -> dict:
    return {
        "age": _calculate_age(lead.date_of_birth),
        "monthly_income": lead.monthly_income,
        "credit_score": credit_score,
        "loan_amount": lead.loan_amount_required,
        "property_value": lead.property_value,
        "employment_type": lead.employment_type,
        "loan_type": lead.loan_type,
    }


@dataclass
class EligibilityResult:
    is_eligible: bool
    reasons: list = field(default_factory=list)


class BREEngine:
    """Generic, data-driven rule interpreter.

    Rules are never hardcoded here — every field, operator, and threshold is
    read from BusinessRule rows in PostgreSQL. Editing/adding/removing a rule
    via the admin API takes effect on the very next lead evaluation.
    """

    def evaluate(self, lead, credit_score) -> EligibilityResult:
        context = build_context(lead, credit_score)
        reasons = []
        logs = []

        rules = BusinessRule.objects.filter(is_active=True).order_by("priority", "id")

        if context["credit_score"] is None:
            reasons.append("Credit score unavailable")

        for rule in rules:
            passed, subject_value, threshold_value = self._evaluate_rule(rule, context)

            logs.append(
                RuleEvaluationLog(
                    lead=lead,
                    rule=rule,
                    field_name_snapshot=rule.field_name,
                    operator_snapshot=rule.operator,
                    resolved_subject_value=str(subject_value),
                    resolved_threshold_value=str(threshold_value),
                    passed=passed,
                    rejection_reason_snapshot=None if passed else rule.rejection_reason,
                )
            )

            if not passed:
                reasons.append(rule.rejection_reason)

        RuleEvaluationLog.objects.bulk_create(logs)

        return EligibilityResult(is_eligible=len(reasons) == 0, reasons=reasons)

    def _evaluate_rule(self, rule: BusinessRule, context: dict):
        subject_raw = context.get(rule.field_name)
        threshold_raw = self._resolve_threshold(rule, context)

        if subject_raw is None:
            return False, subject_raw, threshold_raw

        if rule.field_name in NUMERIC_FIELDS:
            try:
                subject = Decimal(str(subject_raw))
                threshold = Decimal(str(threshold_raw))
            except (InvalidOperation, TypeError):
                return False, subject_raw, threshold_raw
        else:
            subject = str(subject_raw)
            threshold = str(threshold_raw)

        op_func = OPERATOR_FUNCS[rule.operator]
        return op_func(subject, threshold), subject, threshold

    def _resolve_threshold(self, rule: BusinessRule, context: dict):
        if rule.comparison_type == "PERCENT_OF_FIELD":
            reference_raw = context.get(rule.reference_field)
            if reference_raw is None or rule.percent_value is None:
                return None
            return Decimal(str(reference_raw)) * (rule.percent_value / Decimal("100"))
        return rule.value
