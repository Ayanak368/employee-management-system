
from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction
from django.utils.crypto import get_random_string

from accounts.models import UserProfile
from .models import Employee, Department


# ==========================================
# 1. Employee Serializer
# ==========================================

class EmployeeSerializer(serializers.ModelSerializer):

    department_name = serializers.CharField(
        source='department.name',
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = Employee
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'department',
            'department_name',
            'designation',
            'joining_date',
            'salary',
            'status',
        ]

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            profile = getattr(request.user, 'profile', None)

            if not profile or profile.role != 'HR':
                fields.pop('salary', None)

        return fields
# ==========================================
# 2. Login Serializer
# ==========================================

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


# ==========================================
# 3. Department Serializer
# ==========================================


class DepartmentSerializer(serializers.ModelSerializer):
    employee_count = serializers.SerializerMethodField()
    manager_names = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = [
            'id',
            'name',
            'description',
            'employee_count',
            'manager_names',
        ]

    def get_employee_count(self, obj):
        return obj.employees.count()

    def get_manager_names(self, obj):
        managers = obj.managers.filter(
            role='MANAGER'
        ).select_related('user')

        return [
            manager.user.get_full_name() or manager.user.username
            for manager in managers
        ]


# ==========================================
# 4. Employee Account Creation Serializer
# ==========================================

class EmployeeAccountCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Employee
        fields = [
            'name',
            'email',
            'phone',
            'department',
            'designation',
            'joining_date',
            'salary',
            'status',
        ]

    @transaction.atomic
    def create(self, validated_data):

        # Generate unique username
        base_username = validated_data['email'].split('@')[0]
        username = base_username
        count = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{count}"
            count += 1

        # Generate temporary password
        password = get_random_string(12)

        # Create employee
        employee = Employee.objects.create(**validated_data)

        # Create login user
        User.objects.create_user(
            username=username,
            email=employee.email,
            password=password
        )

        user = User.objects.get(username=username)

        # Create employee profile
        UserProfile.objects.create(
            user=user,
            role='EMPLOYEE',
            employee=employee
        )

        # Save credentials for creation response only
        self._credentials = {
            'username': username,
            'temporary_password': password
        }

        return employee

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['login_credentials'] = getattr(
            self, '_credentials', None
        )

        return data


# ==========================================
# 5. Manager Account Creation Serializer
# ==========================================

class ManagerAccountCreateSerializer(serializers.Serializer):

    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()

    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all()
    )

    def validate_email(self, value):

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    @transaction.atomic
    def create(self, validated_data):

        name = validated_data['name']
        email = validated_data['email']
        department = validated_data['department']

        # Generate unique username
        base_username = email.split('@')[0]
        username = base_username
        count = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{count}"
            count += 1

        # Generate temporary password
        password = get_random_string(12)

        # Create Django user
        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=name,
            password=password
        )

        # Create manager profile
        profile = UserProfile.objects.create(
            user=user,
            role='MANAGER',
            department=department
        )

        # Save credentials for creation response only
        self._credentials = {
            'username': username,
            'temporary_password': password
        }

        return profile

    def to_representation(self, instance):

        return {
            'message': 'Manager account created successfully',
            'name': instance.user.first_name,
            'department': instance.department.name,
            'username': self._credentials['username'],
            'temporary_password': self._credentials['temporary_password']
        }


# ==========================================
# 6. Manager List Serializer
# ==========================================

class ManagerListSerializer(serializers.ModelSerializer):

    name = serializers.CharField(
        source='user.first_name'
    )

    email = serializers.EmailField(
        source='user.email'
    )

    department_name = serializers.CharField(
        source='department.name',
        read_only=True
    )

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'name',
            'email',
            'department_name',
        ]
from rest_framework import serializers
from .models import Employee


