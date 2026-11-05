from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView
)
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Employee
from .serializers import EmployeeSerializer


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
def dashboard_stats(request):
    data = {
        'total_employees': Employee.objects.count(),
        'active_employees': Employee.objects.filter(status='Active').count(),
        'inactive_employees': Employee.objects.filter(status='Inactive').count(),
        'total_departments': Employee.objects.values('department').distinct().count(),
    }

    return Response(data)