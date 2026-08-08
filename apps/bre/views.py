from rest_framework import viewsets

from apps.bre.models import BusinessRule
from apps.bre.serializers import BusinessRuleSerializer
from apps.core.permissions import IsAdminRole, IsSuperAdmin


class BusinessRuleViewSet(viewsets.ModelViewSet):
    """Module 6 - BRE Management.

    Admins can list/create/edit rules; only Super Admins can delete a rule.
    Any change here is picked up on the very next POST /api/leads/ call
    since BREEngine always reads is_active rules fresh from the database.
    """

    queryset = BusinessRule.objects.all()
    serializer_class = BusinessRuleSerializer
    permission_classes = [IsAdminRole]

    def get_permissions(self):
        if self.action == "destroy":
            return [IsSuperAdmin()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
