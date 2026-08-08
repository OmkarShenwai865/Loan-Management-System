from django.contrib import admin

from apps.bre.models import BusinessRule, RuleEvaluationLog


@admin.register(BusinessRule)
class BusinessRuleAdmin(admin.ModelAdmin):
    list_display = ["name", "field_name", "operator", "comparison_type", "value", "is_active", "priority"]
    list_filter = ["field_name", "is_active", "comparison_type"]
    search_fields = ["name"]


@admin.register(RuleEvaluationLog)
class RuleEvaluationLogAdmin(admin.ModelAdmin):
    list_display = ["lead", "field_name_snapshot", "operator_snapshot", "passed", "evaluated_at"]
    list_filter = ["passed", "field_name_snapshot"]
    search_fields = ["lead__full_name", "lead__mobile_number"]
