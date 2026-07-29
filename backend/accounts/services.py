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
    """
    # If the identifier looks like an email, try to resolve the corresponding username
    if "@" in username:
        try:
            user_obj = User.objects.get(email=username)
            username = user_obj.username
        except User.DoesNotExist:
            # No user with this email
            raise ValidationError({"email": ["No user found with this email address."]})
    user = authenticate(username=username, password=password)
    if not user:
        # Username exists but password is wrong
        if User.objects.filter(username=username).exists():
            raise ValidationError({"password": ["Incorrect password."]})
        # Fallback (should not reach here because email case handled above)
        raise ValidationError({"username": ["Invalid login credentials."]})
    
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
