from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """Allows access to any authenticated admin (ADMIN or SUPER_ADMIN)."""

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "role", None) in {"ADMIN", "SUPER_ADMIN"})


class IsSuperAdmin(BasePermission):
    """Allows access only to SUPER_ADMIN role. Used for destructive BRE/admin operations."""

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "role", None) == "SUPER_ADMIN")
