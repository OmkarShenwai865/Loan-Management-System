from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return response

    detail = response.data
    message = detail.get("detail") if isinstance(detail, dict) else None

    response.data = {
        "status": "error",
        "message": message or "Request failed.",
        "errors": detail if message is None else None,
    }
    return response


class DomainError(Exception):
    """Raised by service-layer code for business-rule/domain violations."""

    def __init__(self, message, code=None):
        super().__init__(message)
        self.message = message
        self.code = code
