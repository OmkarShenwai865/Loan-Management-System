import requests
from django.conf import settings

from apps.credit_score.exceptions import ProviderAPIError, ProviderTimeoutError
from apps.credit_score.providers.base import BaseCreditScoreProvider, CreditScoreResult


class CRIFProvider(BaseCreditScoreProvider):
    """Real credit-bureau integration (CRIF High Mark / Roopya style API).

    Wire the actual sandbox/production endpoint via CRIF_API_BASE_URL and
    CRIF_API_KEY in settings/.env. Kept isolated behind the same
    BaseCreditScoreProvider contract as MockCreditScoreProvider so
    CreditScoreService never needs to change when switching providers.
    """

    provider_name = "CRIF"

    def fetch_score(self, lead) -> CreditScoreResult:
        if not settings.CRIF_API_BASE_URL or not settings.CRIF_API_KEY:
            raise ProviderAPIError("CRIF provider is not configured (missing base URL/API key).")

        try:
            response = requests.post(
                f"{settings.CRIF_API_BASE_URL}/v1/credit-score",
                headers={"Authorization": f"Bearer {settings.CRIF_API_KEY}"},
                json={
                    "full_name": lead.full_name,
                    "mobile_number": lead.mobile_number,
                    "date_of_birth": str(lead.date_of_birth),
                    "pincode": lead.pincode,
                },
                timeout=settings.CRIF_API_TIMEOUT_SECONDS,
            )
        except requests.Timeout as exc:
            raise ProviderTimeoutError("CRIF provider request timed out.") from exc
        except requests.RequestException as exc:
            raise ProviderAPIError(f"CRIF provider request failed: {exc}") from exc

        if response.status_code != 200:
            raise ProviderAPIError(f"CRIF provider returned HTTP {response.status_code}: {response.text}")

        payload = response.json()
        score = payload.get("credit_score")
        if score is None:
            raise ProviderAPIError("CRIF provider response missing 'credit_score'.")

        return CreditScoreResult(
            provider_name=self.provider_name,
            success=True,
            score=int(score),
            raw_response=payload,
        )
