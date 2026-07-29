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
    Returns aggregated statistics for the dashboard.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Total generated contents
        total = GeneratedContent.objects.filter(user=user).count()
        # Items created this week
        from django.utils import timezone
        from datetime import timedelta
        week_ago = timezone.now() - timedelta(days=7)
        this_week = GeneratedContent.objects.filter(user=user, created_at__gte=week_ago).count()
        # Words drafted (sum of word counts)
        contents = GeneratedContent.objects.filter(user=user).values_list('generated_text', flat=True)
        words = sum(len(text.split()) for text in contents)
        # Avg tone match placeholder (since not stored, return 96)
        avg_tone_match = 96
        data = {
            "total_generated": total,
            "this_week": this_week,
            "words_drafted": words,
            "saved_drafts": total,
            "avg_tone_match": avg_tone_match,
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
