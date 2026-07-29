from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from core.response import standard_response
from .serializers import RegisterSerializer, LoginSerializer
from .services import register_user, authenticate_user, get_user_profile

class RegisterView(APIView):
    """
    POST /api/register/
    Registers a new user and returns JWT tokens.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return standard_response(
                success=False,
                message="Validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        validated_data = serializer.validated_data
        result = register_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        return standard_response(
            success=True,
            message="User registered successfully.",
            data=result,
            status_code=status.HTTP_201_CREATED
        )

class LoginView(APIView):
    """
    POST /api/login/
    Authenticates user and returns JWT access and refresh tokens.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return standard_response(
                success=False,
                message="Validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        validated_data = serializer.validated_data
        result = authenticate_user(
            username=validated_data['email'],
            password=validated_data['password']
        )
        
        return standard_response(
            success=True,
            message="Login successful.",
            data=result,
            status_code=status.HTTP_200_OK
        )

class ProfileView(APIView):
    """
    GET /api/profile/
    Returns authenticated user's profile details.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile_data = get_user_profile(request.user)
        return standard_response(
            success=True,
            message="Profile retrieved successfully.",
            data=profile_data,
            status_code=status.HTTP_200_OK
        )
class ForgotPasswordView(APIView):
    """POST /api/forgot-password/
    Accepts an email and sends a password reset link using Django's built-in mechanisms.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return standard_response(
                success=False,
                message='Email is required.',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        from django.contrib.auth.forms import PasswordResetForm
        form = PasswordResetForm({'email': email})
        if form.is_valid():
            form.save(
                request=request,
                use_https=request.is_secure(),
                email_template_name='registration/password_reset_email.html'
            )
            return standard_response(
                success=True,
                message='Password reset email sent if the address exists.',
                status_code=status.HTTP_200_OK
            )
        else:
            return standard_response(
                success=False,
                message='Invalid email address.',
                errors=form.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )

