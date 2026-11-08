
from datetime import datetime, timedelta, timezone

import jwt

from django.conf import settings
from django.contrib.auth import authenticate
from django.db import transaction
from django.utils.crypto import get_random_string

from rest_framework import status
from rest_framework.decorators import (
    action,
    api_view,
    permission_classes,
)
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView

from accounts.models import UserProfile
from accounts.permissions import IsHR, IsManager

from .models import Employee, Department
from .serializers import (
    EmployeeSerializer,
    EmployeeAccountCreateSerializer,
    DepartmentSerializer,
    LoginSerializer,
    ManagerAccountCreateSerializer,
    ManagerListSerializer,
)


# ==========================================
# 1. EMPLOYEE VIEWSET
# ==========================================

class EmployeeViewSet(ModelViewSet):

    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsHR]

    def get_serializer_class(self):

        if self.action == 'create':
            return EmployeeAccountCreateSerializer

        return EmployeeSerializer

    # Delete employee and associated login account
    @transaction.atomic
    def perform_destroy(self, instance):

        try:
            user = instance.user_profile.user
            user.delete()

        except UserProfile.DoesNotExist:
            pass

        instance.delete()

    # Reset employee password
    @action(
        detail=True,
        methods=['post'],
        url_path='reset-password'
    )
    def reset_password(self, request, pk=None):

        employee = self.get_object()

        try:
            user = employee.user_profile.user

        except UserProfile.DoesNotExist:
            return Response(
                {
                    'error': 'No login account found for this employee.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Generate temporary password
        temporary_password = get_random_string(12)

        # Hash and save the new password
        user.set_password(temporary_password)
        user.save(update_fields=['password'])

        return Response(
            {
                'message': 'Password reset successfully.',
                'username': user.username,
                'temporary_password': temporary_password
            },
            status=status.HTTP_200_OK
        )


# ==========================================
# 2. DEPARTMENT VIEWSET
# ==========================================

class DepartmentViewSet(ModelViewSet):

    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def get_permissions(self):

        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]

        return [IsHR()]


# ==========================================
# 3. MANAGER VIEWSET
# ==========================================

class ManagerViewSet(ModelViewSet):

    queryset = UserProfile.objects.filter(role='MANAGER')
    permission_classes = [IsHR]

    http_method_names = [
        'get',
        'post',
        'delete',
        'options'
    ]

    def get_serializer_class(self):

        if self.action == 'create':
            return ManagerAccountCreateSerializer

        return ManagerListSerializer

    def perform_destroy(self, instance):

        instance.user.delete()


# ==========================================
# 4. DASHBOARD STATISTICS
# ==========================================

@api_view(['GET'])
@permission_classes([IsHR])
def dashboard_stats(request):

    data = {
        'total_employees': Employee.objects.count(),

        'active_employees': Employee.objects.filter(
            status='Active'
        ).count(),

        'inactive_employees': Employee.objects.filter(
            status='Inactive'
        ).count(),

        'total_departments': Department.objects.count(),
    }

    return Response(data)


# ==========================================
# 5. MANAGER EMPLOYEE LIST
# ==========================================

class ManagerEmployeeListView(ListAPIView):

    serializer_class = EmployeeSerializer
    permission_classes = [IsManager]

    def get_queryset(self):

        department = self.request.user.profile.department

        if not department:
            return Employee.objects.none()

        return Employee.objects.filter(
            department=department
        )


# ==========================================
# 6. EMPLOYEE PROFILE
# ==========================================

class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.profile

        data = {
            "username": user.username,
            "name": user.get_full_name() or user.username,
            "email": user.email,
            "role": profile.role,
            "department": None,
            "designation": None,
        }

        if profile.role == "MANAGER":
            data["department"] = (
                profile.department.name if profile.department else None
            )
            data["designation"] = "Manager"

        elif profile.role == "EMPLOYEE" and profile.employee:
            employee = profile.employee
            data.update({
                "name": employee.name,
                "email": employee.email,
                "department": (
                    employee.department.name
                    if employee.department else None
                ),
                "designation": employee.designation,
            })

        return Response(data)



# ==========================================
# 7. LOGIN VIEW (LEGACY CUSTOM JWT)
# ==========================================

class LoginView(APIView):

    def post(self, request):

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:
            return Response(
                {
                    'message': 'Invalid username or password'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        now = datetime.now(timezone.utc)

        # Access token
        access_payload = {
            'user_id': user.id,
            'username': user.username,
            'token_type': 'access',
            'iat': int(now.timestamp()),
            'exp': int(
                (now + timedelta(hours=1)).timestamp()
            )
        }

        # Refresh token
        refresh_payload = {
            'user_id': user.id,
            'username': user.username,
            'token_type': 'refresh',
            'iat': int(now.timestamp()),
            'exp': int(
                (now + timedelta(days=7)).timestamp()
            )
        }

        access_token = jwt.encode(
            access_payload,
            settings.SECRET_KEY,
            algorithm='HS256'
        )

        refresh_token = jwt.encode(
            refresh_payload,
            settings.SECRET_KEY,
            algorithm='HS256'
        )

        return Response(
            {
                'message': 'Login successful',
                'access_token': access_token,
                'refresh_token': refresh_token,
                'token': access_token,
                'username': user.username
            },
            status=status.HTTP_200_OK
        )
