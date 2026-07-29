from django.db import models
from django.contrib.auth.models import User

class GeneratedContent(models.Model):
    """
    Model storing AI generated content items per user.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='generated_contents')
    topic = models.CharField(max_length=255)
    content_type = models.CharField(max_length=100)
    tone = models.CharField(max_length=100)
    additional_instruction = models.TextField(blank=True, null=True)
    generated_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at', '-id']

    def __str__(self):
        return f"{self.user.username} - {self.content_type} on {self.topic} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
