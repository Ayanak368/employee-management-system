
from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(
        source='assigned_to.name',
        read_only=True
    )

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'assigned_by',
            'assigned_to',
            'employee_name',
            'priority',
            'due_date',
            'status',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'assigned_by',
            'created_at',
        ]
