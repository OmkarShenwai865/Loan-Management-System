import openpyxl
from django.http import HttpResponse
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.permissions import IsAdminRole
from apps.leads.exceptions import LeadAlreadyExistsError
from apps.leads.filters import LeadFilter
from apps.leads.models import Lead
from apps.leads.serializers import LeadCreateSerializer, LeadDetailSerializer, LeadListSerializer
from apps.leads.services import LeadCreationService


class LeadCreateAPIView(APIView):
    """Module 7 - REST API: POST /api/leads/

    Public (unauthenticated, but throttled) endpoint used by the customer
    facing loan application form. Accepts customer details, fetches the
    credit score, executes the BRE, stores the lead, and returns the result.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LeadCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            lead = LeadCreationService().create(serializer.validated_data)
        except LeadAlreadyExistsError:
            return Response(
                {"status": "error", "message": "Lead already exists"},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(
            {
                "status": "success",
                "lead_id": lead.id,
                "credit_score": lead.credit_score,
                "bre_status": lead.get_bre_status_display(),
                "reasons": lead.bre_reasons,
            },
            status=status.HTTP_201_CREATED,
        )


class LeadListAPIView(generics.ListAPIView):
    """Module 5 - Lead Management: search, filter, pagination."""

    queryset = Lead.objects.all()
    serializer_class = LeadListSerializer
    permission_classes = [IsAdminRole]
    filterset_class = LeadFilter
    search_fields = ["full_name", "mobile_number"]
    ordering_fields = ["created_at", "credit_score", "monthly_income"]


class LeadDetailAPIView(generics.RetrieveAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadDetailSerializer
    permission_classes = [IsAdminRole]


class LeadExportExcelView(APIView):
    """Bonus - Export Leads to Excel."""

    permission_classes = [IsAdminRole]

    def get(self, request):
        workbook = openpyxl.Workbook()
        sheet = workbook.active
        sheet.title = "Leads"
        sheet.append(
            ["Lead ID", "Customer Name", "Mobile", "Loan Type", "Credit Score", "BRE Status", "Created Date"]
        )

        for lead in Lead.objects.all():
            sheet.append(
                [
                    lead.id,
                    lead.full_name,
                    lead.mobile_number,
                    lead.get_loan_type_display(),
                    lead.credit_score,
                    lead.get_bre_status_display(),
                    lead.created_at.strftime("%Y-%m-%d %H:%M"),
                ]
            )

        response = HttpResponse(content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        response["Content-Disposition"] = "attachment; filename=leads.xlsx"
        workbook.save(response)
        return response
