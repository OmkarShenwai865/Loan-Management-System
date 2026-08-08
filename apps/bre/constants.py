from django.db import models


class RuleField(models.TextChoices):
    AGE = "age", "Age"
    MONTHLY_INCOME = "monthly_income", "Monthly Income"
    CREDIT_SCORE = "credit_score", "Credit Score"
    LOAN_AMOUNT = "loan_amount", "Loan Amount Required"
    PROPERTY_VALUE = "property_value", "Property Value"
    EMPLOYMENT_TYPE = "employment_type", "Employment Type"
    LOAN_TYPE = "loan_type", "Loan Type"


class RuleOperator(models.TextChoices):
    GTE = ">=", "Greater than or equal to"
    LTE = "<=", "Less than or equal to"
    GT = ">", "Greater than"
    LT = "<", "Less than"
    EQ = "==", "Equal to"
    NEQ = "!=", "Not equal to"


class ComparisonType(models.TextChoices):
    ABSOLUTE = "ABSOLUTE", "Absolute value"
    PERCENT_OF_FIELD = "PERCENT_OF_FIELD", "Percentage of another field"


# Fields eligible to be used as a reference in a PERCENT_OF_FIELD rule
# (e.g. "Loan Amount <= 80% of Property Value").
REFERENCE_FIELD_CHOICES = [
    (RuleField.PROPERTY_VALUE, "Property Value"),
    (RuleField.MONTHLY_INCOME, "Monthly Income"),
    (RuleField.LOAN_AMOUNT, "Loan Amount Required"),
]
