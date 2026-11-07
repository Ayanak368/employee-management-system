<<<<<<< HEAD
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

router.register('list', views.EmployeeViewSet, basename='employee')
router.register('departments', views.DepartmentViewSet, basename='department')
router.register(
    'managers',
    views.ManagerViewSet,
    basename='manager'
)

urlpatterns = [
    path('', include(router.urls)),

    path(
        'dashboard-stats/',
        views.dashboard_stats,
        name='dashboard_stats'
    ),

    path(
        'login/',
        views.LoginView.as_view(),
        name='login'
    ),

    path(
        'manager/employees/',
        views.ManagerEmployeeListView.as_view(),
        name='manager_employee_list'
    ),

    path(
        'my-profile/',
        views.EmployeeProfileView.as_view(),
        name='my_profile'
    ),
=======
from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.EmployeeListView.as_view(), name='employee_list'),

    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),

    path('<int:pk>/', views.EmployeeDetailView.as_view(), name='employee_detail'),
    
    path("login/", views.LoginView.as_view(), name="login"),

>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
]