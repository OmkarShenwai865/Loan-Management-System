from rest_framework.routers import DefaultRouter

from apps.bre.views import BusinessRuleViewSet

app_name = "bre"

router = DefaultRouter()
router.register("rules", BusinessRuleViewSet, basename="business-rule")

urlpatterns = router.urls
