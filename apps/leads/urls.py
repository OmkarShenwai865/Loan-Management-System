from django.urls import path

from apps.leads.views import LeadCreateAPIView, LeadDetailAPIView, LeadExportExcelView, LeadListAPIView

app_name = "leads"

urlpatterns = [
    path("", LeadCreateAPIView.as_view(), name="lead-create"),
    path("list/", LeadListAPIView.as_view(), name="lead-list"),
    path("export/", LeadExportExcelView.as_view(), name="lead-export"),
    path("<int:pk>/", LeadDetailAPIView.as_view(), name="lead-detail"),
]
