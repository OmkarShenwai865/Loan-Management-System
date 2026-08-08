from django.utils import timezone
from rest_framework import serializers

from apps.core.validators import validate_mobile_number
from apps.credit_score.serializers import CreditScoreRecordSerializer
from apps.leads.models import Lead


class LeadCreateSerializer(serializers.ModelSerializer):
    consent_given = serializers.BooleanField()
    # No UniqueValidator here on purpose: duplicate mobile numbers are a
    # domain rule (Module 8), not a field-format rule, so they're handled by
    # LeadCreationService -> LeadAlreadyExistsError -> a dedicated
    # {"status": "error", "message": "Lead already exists"} response instead
    # of a generic DRF validation error.
    mobile_number = serializers.CharField(max_length=10, validators=[validate_mobile_number])

    class Meta:
        model = Lead
        fields = [
            "full_name",
            "mobile_number",
            "email",
            "date_of_birth",
            "city",
            "pincode",
            "loan_type",
            "employment_type",
            "monthly_income",
            "loan_amount_required",
            "property_value",
            "consent_given",
        ]

    def validate_date_of_birth(self, value):
        if value >= timezone.now().date():
            raise serializers.ValidationError("Date of birth must be in the past.")
        return value

    def validate_monthly_income(self, value):
        if value <= 0:
            raise serializers.ValidationError("Monthly income must be greater than zero.")
        return value

    def validate_loan_amount_required(self, value):
        if value <= 0:
            raise serializers.ValidationError("Loan amount required must be greater than zero.")
        return value

    def validate_property_value(self, value):
        if value <= 0:
            raise serializers.ValidationError("Property value must be greater than zero.")
        return value

    def validate_consent_given(self, value):
        if not value:
            raise serializers.ValidationError(
                "Consent to share information with lending partners is mandatory."
            )
        return value


class LeadListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            "id",
            "full_name",
            "mobile_number",
            "loan_type",
            "credit_score",
            "bre_status",
            "created_at",
        ]


class LeadDetailSerializer(serializers.ModelSerializer):
    credit_score_history = CreditScoreRecordSerializer(source="credit_score_records", many=True, read_only=True)
    rejection_reasons = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = [
            "id",
            "full_name",
            "mobile_number",
            "email",
            "date_of_birth",
            "city",
            "pincode",
            "loan_type",
            "employment_type",
            "monthly_income",
            "loan_amount_required",
            "property_value",
            "consent_given",
            "consent_timestamp",
            "credit_score",
            "bre_status",
            "credit_score_history",
            "rejection_reasons",
            "created_at",
            "updated_at",
        ]

    def get_rejection_reasons(self, obj):
        return list(
            obj.rule_evaluations.filter(passed=False)
            .order_by("-evaluated_at")
            .values_list("rejection_reason_snapshot", flat=True)[:20]
        )
