from rest_framework.response import Response
from rest_framework import status

def standard_response(success=True, message="", data=None, errors=None, status_code=status.HTTP_200_OK):
    """
    Standard API Response Formatter.
    
    Success format:
    {
        "success": true,
        "message": "...",
        "data": {}
    }
    
    Error format:
    {
        "success": false,
        "message": "...",
        "errors": {}
    }
    """
    payload = {
        "success": success,
        "message": message,
    }
    
    if success:
        payload["data"] = data if data is not None else {}
    else:
        payload["errors"] = errors if errors is not None else {}
        
    return Response(payload, status=status_code)
