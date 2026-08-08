from django.contrib import admin

from apps.credit_score.models import CreditScoreRecord


@admin.register(CreditScoreRecord)
class CreditScoreRecordAdmin(admin.ModelAdmin):
    list_display = ["id", "lead", "provider", "score", "status", "fetched_at"]
    list_filter = ["provider", "status"]
    search_fields = ["lead__full_name", "lead__mobile_number"]
