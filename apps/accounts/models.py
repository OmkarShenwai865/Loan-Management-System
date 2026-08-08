from django.contrib.auth.models import AbstractUser
from django.db import models


class AdminUser(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        SUPER_ADMIN = "SUPER_ADMIN", "Super Admin"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.ADMIN)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
