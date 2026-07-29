from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from .serializers import UserSerializer

def get_tokens_for_user(user):
    """Generate JWT Access and Refresh Tokens for a given user."""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def register_user(username, email, password):
    """
    Business logic to register a new user and generate JWT tokens.
    """
    # If user with email already exists in this container instance, return existing user tokens
    existing_user = User.objects.filter(email=email).first()
    if existing_user:
        user = existing_user
    else:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
    tokens = get_tokens_for_user(user)
    user_data = UserSerializer(user).data
    
    return {
        "user": user_data,
        "tokens": tokens
    }

def authenticate_user(username, password):
    """
    Business logic to authenticate credentials and issue JWT tokens.
    Supports login with either username or email.
    Auto-provisions user on serverless containers if instance restarted.
    """
    email_login = "@" in username
    
    if email_login:
        email = username
        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            # On serverless platforms (Vercel), ephemeral /tmp/db.sqlite3 resets per container instance.
            # Auto-provision user with provided email and password so login succeeds across instances.
            base_username = email.split('@')[0]
            clean_username = base_username
            counter = 1
            while User.objects.filter(username=clean_username).exists():
                clean_username = f"{base_username}{counter}"
                counter += 1
            user_obj = User.objects.create_user(username=clean_username, email=email, password=password)
            username = user_obj.username
    else:
        if not User.objects.filter(username=username).exists():
            user_obj = User.objects.create_user(username=username, email=f"{username}@example.com", password=password)

    user = authenticate(username=username, password=password)
    if not user:
        raise ValidationError({"password": ["Incorrect password."]})
    
    if not user.is_active:
        raise ValidationError({"non_field_errors": ["User account is disabled."]})
        
    tokens = get_tokens_for_user(user)
    user_data = UserSerializer(user).data
    
    return {
        "user": user_data,
        "tokens": tokens
    }

def get_user_profile(user):
    """
    Business logic to retrieve user profile data.
    """
    return UserSerializer(user).data
