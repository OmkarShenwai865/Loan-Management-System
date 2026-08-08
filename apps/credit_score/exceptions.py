class CreditScoreProviderError(Exception):
    """Base exception for credit score provider failures."""


class ProviderTimeoutError(CreditScoreProviderError):
    pass


class ProviderAPIError(CreditScoreProviderError):
    pass
