from django.db.models import Avg, Count, Q
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.permissions import IsAdminRole
from apps.leads.models import Lead


class DashboardStatsAPIView(APIView):
    """Module 4 - Admin Panel dashboard stats."""

    permission_classes = [IsAdminRole]

    def get(self, request):
        aggregates = Lead.objects.aggregate(
            total_leads=Count("id"),
            eligible_leads=Count("id", filter=Q(bre_status=Lead.BREStatus.ELIGIBLE)),
            rejected_leads=Count("id", filter=Q(bre_status=Lead.BREStatus.NOT_ELIGIBLE)),
            average_credit_score=Avg("credit_score"),
        )
        aggregates["average_credit_score"] = round(aggregates["average_credit_score"] or 0, 2)
        return Response(aggregates)
