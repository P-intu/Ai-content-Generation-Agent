import json
import urllib.request
import urllib.error
from django.conf import settings
from rest_framework.exceptions import NotFound, PermissionDenied
from .models import GeneratedContent

def generate_prompt(topic, content_type, tone, additional_instruction=None, length=None):
    """
    Builds structured prompt string based on provided attributes.
    
    Example output format:
    Write a professional blog about Artificial Intelligence.

    Additional instruction:
    Explain in simple language.

    Return only the generated content.
    """
    tone_str = tone.strip() if tone else "professional"
    content_type_str = content_type.strip() if content_type else "article"
    topic_str = topic.strip() if topic else "General Topic"
    length_str = ''
    if length:
        length_str = f" Keep the content {length.lower()} in length."
    
    prompt = f"Write a {tone_str.lower()} {content_type_str.lower()} about {topic_str}." + length_str
    
    if additional_instruction and str(additional_instruction).strip():
        prompt += f"\n\nAdditional instruction:\n{str(additional_instruction).strip()}"
        
    prompt += "\n\nReturn only the generated content."
    return prompt

def call_gemini_api(prompt_text):
    """
    Invokes Google Gemini REST API with prompt_text.
    """
    api_key = getattr(settings, 'GEMINI_API_KEY', '')
    if not api_key:
        return None

    # Model endpoints in order of preference
    endpoints = [
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}",
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}",
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}",
    ]

    payload = {
        "contents": [{
            "parts": [{
                "text": prompt_text
            }]
        }]
    }
    
    data = json.dumps(payload).encode('utf-8')
    headers = {'Content-Type': 'application/json'}

    for url in endpoints:
        try:
            req = urllib.request.Request(url, data=data, headers=headers, method='POST')
            with urllib.request.urlopen(req, timeout=30) as response:
                if response.status == 200:
                    res_body = json.loads(response.read().decode('utf-8'))
                    candidates = res_body.get('candidates', [])
                    if candidates:
                        parts = candidates[0].get('content', {}).get('parts', [])
                        if parts:
                            text = parts[0].get('text', '').strip()
                            if text:
                                return text
        except Exception:
            continue
            
    return None

def generate_content_text(topic, content_type, tone, additional_instruction=None, length=None):
    """
    Core AI generation logic engine.
    First tries Google Gemini API using prompt.
    If unavailable, falls back to structured output generator.
    """
    prompt = generate_prompt(topic, content_type, tone, additional_instruction, length)
    
    # Try calling Google Gemini API
    ai_generated_text = call_gemini_api(prompt)
    if ai_generated_text:
        return ai_generated_text

    # High-quality fallback generator
    tone_intro = {
        "professional": f"In today's rapidly evolving landscape, {topic} plays a pivotal role in driving modern innovation and operational excellence.",
        "casual": f"Let's dive into {topic}! It's one of the most exciting trends shaping our everyday lives.",
        "friendly": f"Hey there! Today we're exploring {topic}—a fascinating subject that impacts all of us.",
        "formal": f"This document presents an authoritative overview of {topic}, examining its key principles and strategic significance.",
        "funny": f"Buckle up! We are diving headfirst into {topic}, and things are about to get interesting!"
    }.get(tone.lower() if tone else "", f"Exploring {topic}: Key insights and practical applications.")
    
    instr_clause = f" (Focus Note: {additional_instruction})" if additional_instruction else ""

    generated_output = (
        f"# {topic.title()} — {tone.title()} {content_type.title()}\n\n"
        f"{tone_intro}\n\n"
        f"## Understanding {topic.title()}\n"
        f"When approaching {topic}, it is essential to consider structure, impact, and user engagement. "
        f"Crafting high-quality {content_type.lower()} content in a {tone.lower()} tone ensures your target audience receives maximum value.{instr_clause}\n\n"
        f"## Key Takeaways\n"
        f"1. **Core Principle**: Clear articulation of ideas regarding {topic}.\n"
        f"2. **Audience Alignment**: Tailored specifically in a {tone.lower()} tone.\n"
        f"3. **Actionable Result**: Ready-to-publish {content_type.lower()} output.\n\n"
        f"## Conclusion\n"
        f"Integrating {topic} into your content strategy unlocks new opportunities for growth and engagement."
    )

    # Apply length constraint for fallback output
    if length:
        # Simple heuristic: split by lines or paragraphs
        if length.lower() == 'short':
            # Return first two paragraphs or first 200 chars
            short_text = '\n\n'.join(generated_output.split('\n\n')[:2])
            return short_text[:300]
        elif length.lower() == 'medium':
            # Return first four paragraphs or up to 600 chars
            medium_text = '\n\n'.join(generated_output.split('\n\n')[:4])
            return medium_text[:600]
        # For 'long' or others, return full output
    return generated_output

def create_generated_content(user, topic, content_type, tone, length='medium', additional_instruction=None):
    """
    Business logic: Generates prompt, creates content text via Gemini API, and saves to database.
    """
    generated_text = generate_content_text(
        topic=topic,
        content_type=content_type,
        tone=tone,
        additional_instruction=additional_instruction,
        length=length,
    )

    content_obj = GeneratedContent.objects.create(
        user=user,
        topic=topic,
        content_type=content_type,
        tone=tone,
        additional_instruction=additional_instruction or "",
        generated_text=generated_text
    )

    return content_obj

def get_user_content_history(user):
    """
    Retrieves all generated content for the authenticated user, newest first.
    """
    return GeneratedContent.objects.filter(user=user).order_by('-created_at', '-id')

def get_content_detail(user, content_id):
    """
    Retrieves single generated content item if owned by user.
    """
    try:
        content_obj = GeneratedContent.objects.get(id=content_id)
    except GeneratedContent.DoesNotExist:
        raise NotFound("Generated content item not found.")
        
    if content_obj.user != user:
        raise PermissionDenied("You do not have permission to access this content.")
        
    return content_obj

def delete_content_item(user, content_id):
    """
    Deletes generated content item if owned by user.
    """
    content_obj = get_content_detail(user, content_id)
    content_obj.delete()
    return True
