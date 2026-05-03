from typing import List

# Define available roles in the system
ROLES = {
    "voter": ["view_guide", "use_simulator", "check_misinformation"],
    "student": ["view_guide", "use_simulator", "check_misinformation", "view_student_resources"],
    "admin": ["view_guide", "use_simulator", "check_misinformation", "view_analytics", "manage_content"],
}

def get_permissions_for_role(role: str) -> List[str]:
    """
    Returns a list of permissions associated with a specific user role.
    """
    return ROLES.get(role.lower(), ROLES["voter"])

def check_user_permissions(role: str, required_permission: str) -> bool:
    """
    Validates if a specific role has the required permission to perform an action.
    """
    permissions = get_permissions_for_role(role)
    return required_permission in permissions
