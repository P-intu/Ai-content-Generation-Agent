from rest_framework import serializers
from .models import GeneratedContent

class GenerateContentRequestSerializer(serializers.Serializer):
    """
    Serializer for incoming generate content API requests.
    """
    topic = serializers.CharField(max_length=255, required=True)
    content_type = serializers.CharField(max_length=100, required=True)
    tone = serializers.CharField(max_length=100, required=True)
    length = serializers.CharField(max_length=10, required=False, allow_blank=True, allow_null=True, default='medium')
    additional_instruction = serializers.CharField(required=False, allow_blank=True, allow_null=True, default="")

class GeneratedContentSerializer(serializers.ModelSerializer):
    """
    Serializer for returning GeneratedContent model representation.
    """
    class Meta:
        model = GeneratedContent
        fields = ('id', 'topic', 'content_type', 'tone', 'additional_instruction', 'generated_text', 'created_at')
