import logging

from apps.credit_score.exceptions import CreditScoreProviderError
from apps.credit_score.models import CreditScoreRecord
from apps.credit_score.providers.factory import get_fallback_provider, get_provider

logger = logging.getLogger(__name__)


class CreditScoreService:
    """Facade used by the rest of the system to obtain a lead's credit score.

    Callers (LeadCreationService, admin re-fetch endpoint) never talk to a
    provider directly. This service tries the configured primary provider
    and transparently falls back to the mock provider on any failure, while
    logging every attempt (success or failure) to CreditScoreRecord for audit.
    """

    def fetch(self, lead) -> CreditScoreRecord:
        provider = get_provider()
        try:
            result = provider.fetch_score(lead)
        except CreditScoreProviderError as exc:
            logger.warning("Credit score provider %s failed for lead %s: %s", provider.provider_name, lead.id, exc)
            CreditScoreRecord.objects.create(
                lead=lead,
                provider=provider.provider_name,
                status=CreditScoreRecord.Status.FAILED,
                error_message=str(exc),
            )
            result = get_fallback_provider().fetch_score(lead)

        return CreditScoreRecord.objects.create(
            lead=lead,
            provider=result.provider_name,
            status=CreditScoreRecord.Status.SUCCESS if result.success else CreditScoreRecord.Status.FAILED,
            score=result.score,
            raw_response=result.raw_response,
            error_message=result.error_message,
        )
