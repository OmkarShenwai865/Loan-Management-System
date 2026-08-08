from django.conf import settings

from apps.credit_score.providers.base import BaseCreditScoreProvider
from apps.credit_score.providers.crif_provider import CRIFProvider
from apps.credit_score.providers.mock_provider import MockCreditScoreProvider

_PROVIDERS = {
    "crif": CRIFProvider,
    "mock": MockCreditScoreProvider,
}


def get_provider() -> BaseCreditScoreProvider:
    """Returns the configured primary provider instance.

    Controlled entirely by settings.CREDIT_SCORE_PROVIDER (env: CREDIT_SCORE_PROVIDER),
    so switching providers never requires a code change.
    """
    provider_cls = _PROVIDERS.get(settings.CREDIT_SCORE_PROVIDER.lower(), MockCreditScoreProvider)
    return provider_cls()


def get_fallback_provider() -> BaseCreditScoreProvider:
    return MockCreditScoreProvider()
