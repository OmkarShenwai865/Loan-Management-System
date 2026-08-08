from django.conf import settings
from django.db import models

from apps.bre.constants import ComparisonType, RuleField, RuleOperator
from apps.core.models import TimeStampedModel


class BusinessRule(TimeStampedModel):
    """A single eligibility rule, fully data-driven — never hardcoded in
    Python. The BREEngine (apps/bre/engine.py) reads active rows from this
    table and evaluates them dynamically against each lead.
    """

    name = models.CharField(max_length=150)
    field_name = models.CharField(max_length=30, choices=RuleField.choices)
    operator = models.CharField(max_length=5, choices=RuleOperator.choices)
    comparison_type = models.CharField(
        max_length=20, choices=ComparisonType.choices, default=ComparisonType.ABSOLUTE
    )
    # Threshold when comparison_type == ABSOLUTE (numeric or a string like
    # "SALARIED" for employment_type/loan_type equality rules).
    value = models.CharField(max_length=50, blank=True, null=True)
    # Percentage threshold when comparison_type == PERCENT_OF_FIELD, e.g. 80
    # for "Loan Amount <= 80% of Property Value".
    percent_value = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    reference_field = models.CharField(max_length=30, choices=RuleField.choices, blank=True, null=True)
    rejection_reason = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    priority = models.PositiveIntegerField(default=0, help_text="Lower runs first.")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="business_rules"
    )

    class Meta:
        ordering = ["priority", "id"]

    def __str__(self):
        if self.comparison_type == ComparisonType.PERCENT_OF_FIELD:
            return f"{self.field_name} {self.operator} {self.percent_value}% of {self.reference_field}"
        return f"{self.field_name} {self.operator} {self.value}"


class RuleEvaluationLog(TimeStampedModel):
    """Audit trail of every rule evaluated for every lead, with a snapshot of
    the rule's configuration at evaluation time — so results stay explainable
    even if the rule is later edited or deleted.
    """

    lead = models.ForeignKey("leads.Lead", on_delete=models.CASCADE, related_name="rule_evaluations")
    rule = models.ForeignKey(BusinessRule, on_delete=models.SET_NULL, null=True, related_name="evaluation_logs")
    field_name_snapshot = models.CharField(max_length=30)
    operator_snapshot = models.CharField(max_length=5)
    resolved_subject_value = models.CharField(max_length=50)
    resolved_threshold_value = models.CharField(max_length=50)
    passed = models.BooleanField()
    rejection_reason_snapshot = models.CharField(max_length=255, blank=True, null=True)
    evaluated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-evaluated_at"]

    def __str__(self):
        return f"Lead#{self.lead_id} - {self.field_name_snapshot} - {'PASS' if self.passed else 'FAIL'}"
