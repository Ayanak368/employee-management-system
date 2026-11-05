from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.EmployeeListView.as_view(), name='employee_list'),

    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),

    path('<int:pk>/', views.EmployeeDetailView.as_view(), name='employee_detail'),
]