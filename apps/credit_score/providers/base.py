from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Optional


@dataclass
class CreditScoreResult:
    provider_name: str
    success: bool
    score: Optional[int] = None
    raw_response: Optional[Any] = None
    error_message: Optional[str] = None


class BaseCreditScoreProvider(ABC):
    """Contract every credit score provider must implement.

    CreditScoreService depends only on this interface, so providers can be
    swapped (CRIF -> Roopya -> Mock) via configuration without touching any
    BRE or lead-creation logic.
    """

    provider_name: str

    @abstractmethod
    def fetch_score(self, lead) -> CreditScoreResult:
        ...
