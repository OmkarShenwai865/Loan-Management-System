import django_filters

from apps.leads.models import Lead


class LeadFilter(django_filters.FilterSet):
    created_after = django_filters.DateFilter(field_name="created_at", lookup_expr="date__gte")
    created_before = django_filters.DateFilter(field_name="created_at", lookup_expr="date__lte")

    class Meta:
        model = Lead
        fields = ["loan_type", "employment_type", "bre_status", "created_after", "created_before"]
