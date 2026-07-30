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
    Raises ValidationError if the email or username is already taken.
    """
    if User.objects.filter(email=email).exists():
        raise ValidationError({"email": ["An account with this email already exists."]})
    if User.objects.filter(username=username).exists():
        raise ValidationError({"username": ["This username is already taken."]})

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
    Supports login with email. Raises ValidationError if user not found.
    """
    email_login = "@" in username

    if email_login:
        email = username
        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            raise ValidationError({"email": ["No account found with this email. Please register first."]})
    else:
        if not User.objects.filter(username=username).exists():
            raise ValidationError({"username": ["No account found with this username. Please register first."]})

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
