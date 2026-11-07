from rest_framework.generics import (
    GenericAPIView,
    ListAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view

from django.contrib.auth import authenticate
from django.conf import settings

from datetime import datetime, timedelta, timezone
import jwt

from rest_framework.decorators import api_view, permission_classes
from accounts.permissions import IsHR, IsManager

from .models import Employee, Department
from .serializers import (
    EmployeeAccountCreateSerializer,
    EmployeeSerializer,
    DepartmentSerializer,
    LoginSerializer,
    ManagerAccountCreateSerializer,
    ManagerListSerializer

)
from accounts.models import UserProfile

from rest_framework.viewsets import ModelViewSet

class EmployeeViewSet(ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsHR]

    def get_serializer_class(self):
        if self.action == 'create':
            return EmployeeAccountCreateSerializer

        return EmployeeSerializer

    
    
class DepartmentViewSet(ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]

        return [IsHR()]
    
class ManagerViewSet(ModelViewSet):
    queryset = UserProfile.objects.filter(role='MANAGER')
    permission_classes = [IsHR]
    http_method_names = ['get', 'post', 'options']

    def get_serializer_class(self):
        if self.action == 'create':
            return ManagerAccountCreateSerializer

        return ManagerListSerializer  
    

from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework import serializers
import jwt
from datetime import datetime, timedelta, timezone


from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView
)
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Employee
from .serializers import EmployeeSerializer
from .serializers import LoginSerializer


# GET all employees and POST new employee
class EmployeeListView(ListCreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


# GET, PUT, PATCH and DELETE one employee
class EmployeeDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


# Dashboard statistics
@api_view(['GET'])
@permission_classes([IsHR])
def dashboard_stats(request):
    data = {
        'total_employees': Employee.objects.count(),
        'active_employees': Employee.objects.filter(status='Active').count(),
        'inactive_employees': Employee.objects.filter(status='Inactive').count(),
        'total_departments': Employee.objects.values('department').distinct().count(),
    }

    return Response(data)

class DepartmentListView(ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    
    
class ManagerEmployeeListView(ListAPIView):
    serializer_class = EmployeeSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        department = self.request.user.profile.department

        if not department:
            return Employee.objects.none()

        return Employee.objects.filter(department=department)


class EmployeeProfileView(RetrieveAPIView):
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_profile = self.request.user.profile
        return user_profile.employee

class ManagerViewSet(ModelViewSet):
    queryset = UserProfile.objects.filter(role='MANAGER')
    permission_classes = [IsHR]
    http_method_names = ['get', 'post', 'delete', 'options']

    def get_serializer_class(self):
        if self.action == 'create':
            return ManagerAccountCreateSerializer

        return ManagerListSerializer

    def perform_destroy(self, instance):
        # Delete manager's login account.
        # The related UserProfile is deleted automatically.
        instance.user.delete()


 # Login view


class LoginView(GenericAPIView):

    serializer_class = LoginSerializer

    def post(self, request):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        # Verify username and password
        user = authenticate(
            username=username,
            password=password
        )

        if user is None:
            return Response(
                {"message": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        now = datetime.now(timezone.utc)

        # Access token payload
        access_payload = {
            "user_id": user.id,
            "username": user.username,
            "token_type": "access",
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(hours=1)).timestamp())
        }

        # Refresh token payload
        refresh_payload = {
            "user_id": user.id,
            "username": user.username,
            "token_type": "refresh",
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(days=7)).timestamp())
        }

        # Generate access token
        access_token = jwt.encode(
            access_payload,
            settings.SECRET_KEY,
            algorithm="HS256"
        )

        # Generate refresh token
        refresh_token = jwt.encode(
            refresh_payload,
            settings.SECRET_KEY,
            algorithm="HS256"
        )

        return Response({
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token": access_token,
            "username": user.username
        })
