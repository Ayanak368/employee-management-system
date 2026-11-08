
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

router.register('list', views.EmployeeViewSet, basename='employee')
router.register('departments', views.DepartmentViewSet, basename='department')
router.register('managers', views.ManagerViewSet, basename='manager')

urlpatterns = [
    path('', include(router.urls)),

    path(
        'dashboard-stats/',
        views.dashboard_stats,
        name='dashboard_stats'
    ),

    path(
        'manager/employees/',
        views.ManagerEmployeeListView.as_view(),
        name='manager_employee_list'
    ),

path(
    'profile/',
    views.MyProfileView.as_view(),
    name='my_profile_details'
),
    
]
