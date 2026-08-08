from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Loan Eligibility & Lead Management API",
        default_version="v1",
        description="Loan Eligibility & Lead Management Module",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/leads/", include("apps.leads.urls")),
    path("api/bre/", include("apps.bre.urls")),
    path("api/dashboard/", include("apps.dashboard.urls")),
    path("api/docs/", schema_view.with_ui("swagger", cache_timeout=0), name="api-docs"),
]
