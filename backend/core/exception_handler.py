from rest_framework.views import exception_handler
from rest_framework import status
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    """
    Custom DRF exception handler ensuring all errors follow standard format:
    {
        "success": false,
        "message": "...",
        "errors": {}
    }
    """
    response = exception_handler(exc, context)
    
    if response is not None:
        message = "An error occurred."
        errors = response.data

        if response.status_code == status.HTTP_400_BAD_REQUEST:
            message = "Validation failed."
        elif response.status_code == status.HTTP_401_UNAUTHORIZED:
            message = "Authentication credentials were not provided or are invalid."
        elif response.status_code == status.HTTP_403_FORBIDDEN:
            message = "You do not have permission to perform this action."
        elif response.status_code == status.HTTP_404_NOT_FOUND:
            message = "Resource not found."
        elif response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED:
            message = "Method not allowed."
        elif isinstance(response.data, dict) and "detail" in response.data:
            message = str(response.data["detail"])
            errors = response.data

        # Standardize response structure
        response.data = {
            "success": False,
            "message": message,
            "errors": errors
        }
    else:
        # Unhandled exceptions (e.g. 500 Internal Server Errors)
        response = Response(
            {
                "success": False,
                "message": "Internal server error.",
                "errors": {"detail": str(exc)}
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
