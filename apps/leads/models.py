from django.db import models

from apps.core.models import TimeStampedModel
from apps.core.validators import validate_mobile_number, validate_pincode


class Lead(TimeStampedModel):
    class LoanType(models.TextChoices):
        HOME_LOAN = "HOME_LOAN", "Home Loan"
        LAP = "LAP", "Loan Against Property"

    class EmploymentType(models.TextChoices):
        SALARIED = "SALARIED", "Salaried"
        SELF_EMPLOYED = "SELF_EMPLOYED", "Self Employed"

    class BREStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        ELIGIBLE = "ELIGIBLE", "Eligible"
        NOT_ELIGIBLE = "NOT_ELIGIBLE", "Not Eligible"

    # Customer details
    full_name = models.CharField(max_length=150)
    mobile_number = models.CharField(max_length=10, unique=True, db_index=True, validators=[validate_mobile_number])
    email = models.EmailField()
    date_of_birth = models.DateField()
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=6, validators=[validate_pincode])

    # Loan details
    loan_type = models.CharField(max_length=20, choices=LoanType.choices)
    employment_type = models.CharField(max_length=20, choices=EmploymentType.choices)
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2)
    loan_amount_required = models.DecimalField(max_digits=14, decimal_places=2)
    property_value = models.DecimalField(max_digits=14, decimal_places=2)

    # Consent
    consent_given = models.BooleanField(default=False)
    consent_timestamp = models.DateTimeField(null=True, blank=True)

    # BRE / credit score outcome (denormalized for fast list/dashboard reads;
    # source of truth for the "why" is credit_score.CreditScoreRecord and
    # bre.RuleEvaluationLog).
    credit_score = models.PositiveIntegerField(null=True, blank=True)
    bre_status = models.CharField(max_length=20, choices=BREStatus.choices, default=BREStatus.PENDING)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["bre_status"]),
            models.Index(fields=["loan_type"]),
        ]

    def __str__(self):
        return f"{self.full_name} ({self.mobile_number})"
