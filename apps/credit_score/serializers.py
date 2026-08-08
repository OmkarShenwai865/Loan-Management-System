from rest_framework import serializers

from apps.credit_score.models import CreditScoreRecord


class CreditScoreRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditScoreRecord
        fields = ["id", "provider", "score", "status", "error_message", "fetched_at"]
