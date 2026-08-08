import random

from apps.credit_score.providers.base import BaseCreditScoreProvider, CreditScoreResult


class MockCreditScoreProvider(BaseCreditScoreProvider):
    """Deterministic mock provider used for local development/demo and as the
    automatic fallback when a real provider is unreachable.

    The score is seeded from the applicant's mobile number so the same
    applicant consistently gets the same demo score across repeated calls.
    """

    provider_name = "MOCK"

    def fetch_score(self, lead) -> CreditScoreResult:
        rng = random.Random(lead.mobile_number)
        score = rng.randint(300, 900)
        return CreditScoreResult(
            provider_name=self.provider_name,
            success=True,
            score=score,
            raw_response={"mobile_number": lead.mobile_number, "score": score, "source": "mock"},
        )
