from django.contrib import admin

from apps.leads.models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ["id", "full_name", "mobile_number", "loan_type", "credit_score", "bre_status", "created_at"]
    list_filter = ["loan_type", "employment_type", "bre_status"]
    search_fields = ["full_name", "mobile_number", "email"]
