from rest_framework import serializers

from apps.bre.constants import ComparisonType
from apps.bre.models import BusinessRule


class BusinessRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessRule
        fields = [
            "id",
            "name",
            "field_name",
            "operator",
            "comparison_type",
            "value",
            "percent_value",
            "reference_field",
            "rejection_reason",
            "is_active",
            "priority",
            "created_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]

    def validate(self, attrs):
        comparison_type = attrs.get("comparison_type", getattr(self.instance, "comparison_type", None))

        if comparison_type == ComparisonType.PERCENT_OF_FIELD:
            percent_value = attrs.get("percent_value", getattr(self.instance, "percent_value", None))
            reference_field = attrs.get("reference_field", getattr(self.instance, "reference_field", None))
            if percent_value is None or not reference_field:
                raise serializers.ValidationError(
                    "percent_value and reference_field are required when comparison_type is PERCENT_OF_FIELD."
                )
        else:
            value = attrs.get("value", getattr(self.instance, "value", None))
            if not value:
                raise serializers.ValidationError("value is required when comparison_type is ABSOLUTE.")

        return attrs
