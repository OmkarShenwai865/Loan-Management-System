from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.accounts.models import AdminUser


@admin.register(AdminUser)
class AdminUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (("Role", {"fields": ("role",)}),)
    list_display = ["username", "email", "role", "is_active", "is_staff"]
