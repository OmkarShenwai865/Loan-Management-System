from django.core.management.base import BaseCommand

from apps.bre.constants import ComparisonType, RuleField, RuleOperator
from apps.bre.models import BusinessRule

SEED_RULES = [
    dict(
        name="Minimum Age",
        field_name=RuleField.AGE,
        operator=RuleOperator.GTE,
        comparison_type=ComparisonType.ABSOLUTE,
        value="21",
        rejection_reason="Applicant below minimum age requirement",
        priority=10,
    ),
    dict(
        name="Maximum Age",
        field_name=RuleField.AGE,
        operator=RuleOperator.LTE,
        comparison_type=ComparisonType.ABSOLUTE,
        value="60",
        rejection_reason="Applicant above maximum age limit",
        priority=20,
    ),
    dict(
        name="Minimum Monthly Income",
        field_name=RuleField.MONTHLY_INCOME,
        operator=RuleOperator.GTE,
        comparison_type=ComparisonType.ABSOLUTE,
        value="30000",
        rejection_reason="Monthly Income below eligibility criteria",
        priority=30,
    ),
    dict(
        name="Minimum Credit Score",
        field_name=RuleField.CREDIT_SCORE,
        operator=RuleOperator.GTE,
        comparison_type=ComparisonType.ABSOLUTE,
        value="700",
        rejection_reason="Credit Score below minimum requirement",
        priority=40,
    ),
    dict(
        name="Loan Amount vs Property Value",
        field_name=RuleField.LOAN_AMOUNT,
        operator=RuleOperator.LTE,
        comparison_type=ComparisonType.PERCENT_OF_FIELD,
        percent_value="80",
        reference_field=RuleField.PROPERTY_VALUE,
        rejection_reason="Loan Amount exceeds eligible limit",
        priority=50,
    ),
]


class Command(BaseCommand):
    help = "Seeds the initial Business Rule Engine rules from the assessment spec."

    def handle(self, *args, **options):
        created_count = 0
        for rule_data in SEED_RULES:
            _, created = BusinessRule.objects.get_or_create(
                name=rule_data["name"],
                defaults=rule_data,
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"Seeded {created_count} new BRE rule(s)."))
