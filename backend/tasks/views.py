
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Task
from .serializers import TaskSerializer
from .permissions import IsManagerOrEmployee


class TaskViewSet(ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsManagerOrEmployee]

    def get_queryset(self):
        profile = self.request.user.profile

        if profile.role == 'MANAGER':
            return Task.objects.filter(
                assigned_to__department=profile.department
            )

        if profile.role == 'EMPLOYEE':
            return Task.objects.filter(
                assigned_to=profile.employee
            )

        return Task.objects.none()

    def perform_create(self, serializer):
        profile = self.request.user.profile

        if profile.role != 'MANAGER':
            raise PermissionDenied(
                "Only managers can assign tasks."
            )

        employee = serializer.validated_data['assigned_to']

        if employee.department != profile.department:
            raise PermissionDenied(
                "You can only assign tasks to employees in your department."
            )

        serializer.save(assigned_by=self.request.user)

    def perform_update(self, serializer):
        profile = self.request.user.profile

        if profile.role == 'EMPLOYEE':
            allowed_fields = {'status'}

            if set(self.request.data.keys()) - allowed_fields:
                raise PermissionDenied(
                    "Employees can only update task status."
                )

            serializer.save(
                status=self.request.data.get('status')
            )

        elif profile.role == 'MANAGER':
            employee = serializer.validated_data.get(
                'assigned_to',
                serializer.instance.assigned_to
            )

            if employee.department != profile.department:
                raise PermissionDenied(
                    "You cannot assign tasks outside your department."
                )

            serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.profile.role != 'MANAGER':
            raise PermissionDenied(
                "Only managers can delete tasks."
            )

        instance.delete()
