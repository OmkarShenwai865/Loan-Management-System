from django.db import models

from apps.core.models import TimeStampedModel


class CreditScoreRecord(TimeStampedModel):
    class Provider(models.TextChoices):
        CRIF = "CRIF", "CRIF High Mark"
        ROOPYA = "ROOPYA", "Roopya"
        MOCK = "MOCK", "Mock Provider"

    class Status(models.TextChoices):
        SUCCESS = "SUCCESS", "Success"
        FAILED = "FAILED", "Failed"

    lead = models.ForeignKey(
        "leads.Lead", on_delete=models.CASCADE, related_name="credit_score_records"
    )
    provider = models.CharField(max_length=20, choices=Provider.choices)
    score = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices)
    raw_response = models.JSONField(null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)
    fetched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-fetched_at"]

    def __str__(self):
        return f"Lead#{self.lead_id} - {self.provider} - {self.score or 'N/A'}"
