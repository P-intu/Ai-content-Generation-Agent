from django.db import models
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from core.response import standard_response
from .serializers import GenerateContentRequestSerializer, GeneratedContentSerializer
from .models import GeneratedContent
from .services import (
    create_generated_content,
    get_user_content_history,
    get_content_detail,
    delete_content_item
)

class DashboardStatsView(APIView):
    """
    GET /api/content/dashboard/
    Returns aggregated statistics for the dashboard:
    - total_generated, most_used_content_type, most_used_tone, last_generated
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        qs = GeneratedContent.objects.filter(user=user)

        total = qs.count()

        # Most used content type
        most_used_type = (
            qs.values('content_type')
            .annotate(count=models.Count('id'))
            .order_by('-count')
            .first()
        )
        most_content_type = most_used_type['content_type'] if most_used_type else 'N/A'

        # Most used tone
        most_used_tone = (
            qs.values('tone')
            .annotate(count=models.Count('id'))
            .order_by('-count')
            .first()
        )
        most_tone = most_used_tone['tone'] if most_used_tone else 'N/A'

        # Last generated date
        latest = qs.order_by('-created_at').first()
        last_generated = latest.created_at.isoformat() if latest else None

        data = {
            "total_generated": total,
            "most_used_content_type": most_content_type,
            "most_used_tone": most_tone,
            "last_generated": last_generated,
        }
        return standard_response(True, "Dashboard stats retrieved", data, status.HTTP_200_OK)

class GenerateContentView(APIView):
    """
    POST /api/content/generate/
    Generates new content based on user inputs, saves to database, and returns saved object.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GenerateContentRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return standard_response(
                success=False,
                message="Validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        validated = serializer.validated_data
        content_obj = create_generated_content(
            user=request.user,
            topic=validated['topic'],
            content_type=validated['content_type'],
            tone=validated['tone'],
            length=validated.get('length', 'medium'),
            additional_instruction=validated.get('additional_instruction', '')
        )
        
        data = GeneratedContentSerializer(content_obj).data
        return standard_response(
            success=True,
            message="Content generated successfully.",
            data=data,
            status_code=status.HTTP_201_CREATED
        )

class ContentHistoryView(APIView):
    """
    GET /api/content/history/
    Retrieves all generated content for the authenticated user, ordered newest first.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        history_qs = get_user_content_history(request.user)
        data = GeneratedContentSerializer(history_qs, many=True).data
        return standard_response(
            success=True,
            message="Content history retrieved successfully.",
            data=data,
            status_code=status.HTTP_200_OK
        )

class ContentDetailView(APIView):
    """
    GET /api/content/<id>/
    DELETE /api/content/<id>/
    View or delete a single content item owned by the logged-in user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        content_obj = get_content_detail(user=request.user, content_id=pk)
        data = GeneratedContentSerializer(content_obj).data
        return standard_response(
            success=True,
            message="Content item retrieved successfully.",
            data=data,
            status_code=status.HTTP_200_OK
        )

    def delete(self, request, pk):
        delete_content_item(user=request.user, content_id=pk)
        return standard_response(
            success=True,
            message="Content item deleted successfully.",
            data={},
            status_code=status.HTTP_200_OK
        )
