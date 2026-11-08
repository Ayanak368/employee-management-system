
from rest_framework.permissions import BasePermission


class IsManagerOrEmployee(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        profile = getattr(request.user, 'profile', None)

        return (
            profile is not None
            and profile.role in ['MANAGER', 'EMPLOYEE']
        )
