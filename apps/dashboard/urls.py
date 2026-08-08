from django.urls import path

from apps.dashboard.views import DashboardStatsAPIView

app_name = "dashboard"

urlpatterns = [
    path("stats/", DashboardStatsAPIView.as_view(), name="stats"),
]
