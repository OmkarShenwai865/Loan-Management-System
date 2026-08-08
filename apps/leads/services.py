from django.db import transaction
from django.utils import timezone

from apps.bre.engine import BREEngine
from apps.credit_score.services import CreditScoreService
from apps.leads.exceptions import LeadAlreadyExistsError
from apps.leads.models import Lead


class LeadCreationService:
    """Orchestrates Module 7's POST /api/leads/ contract end-to-end:
    duplicate check -> create lead -> fetch credit score -> run BRE -> persist.
    """

    def __init__(self, credit_score_service=None, bre_engine=None):
        self.credit_score_service = credit_score_service or CreditScoreService()
        self.bre_engine = bre_engine or BREEngine()

    def create(self, validated_data: dict) -> Lead:
        mobile_number = validated_data["mobile_number"]
        existing = Lead.objects.filter(mobile_number=mobile_number).first()
        if existing:
            raise LeadAlreadyExistsError(existing)

        with transaction.atomic():
            lead = Lead.objects.create(
                full_name=validated_data["full_name"],
                mobile_number=mobile_number,
                email=validated_data["email"],
                date_of_birth=validated_data["date_of_birth"],
                city=validated_data["city"],
                pincode=validated_data["pincode"],
                loan_type=validated_data["loan_type"],
                employment_type=validated_data["employment_type"],
                monthly_income=validated_data["monthly_income"],
                loan_amount_required=validated_data["loan_amount_required"],
                property_value=validated_data["property_value"],
                consent_given=validated_data["consent_given"],
                consent_timestamp=timezone.now(),
            )

        credit_score_record = self.credit_score_service.fetch(lead)
        result = self.bre_engine.evaluate(lead, credit_score_record.score)

        lead.credit_score = credit_score_record.score
        lead.bre_status = Lead.BREStatus.ELIGIBLE if result.is_eligible else Lead.BREStatus.NOT_ELIGIBLE
        lead.save(update_fields=["credit_score", "bre_status", "updated_at"])

        lead.bre_reasons = result.reasons
        return lead
