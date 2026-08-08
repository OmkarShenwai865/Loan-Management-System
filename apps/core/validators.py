import re

from django.core.exceptions import ValidationError

MOBILE_REGEX = re.compile(r"^[6-9]\d{9}$")
PINCODE_REGEX = re.compile(r"^\d{6}$")


def validate_mobile_number(value):
    if not MOBILE_REGEX.match(value):
        raise ValidationError("Enter a valid 10-digit mobile number.")


def validate_pincode(value):
    if not PINCODE_REGEX.match(value):
        raise ValidationError("Enter a valid 6-digit pincode.")
