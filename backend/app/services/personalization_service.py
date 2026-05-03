from fastapi import HTTPException

from app.core.logging import logger
from app.domain.election_rules import get_rules_for_role


class PersonalizationService:
    """
    Service class for handling personalized user flows.
    """
    def __init__(self):
        pass

    async def get_personalized_flow(self, age: int, role: str) -> dict:
        """
        Determines the appropriate guidance flow based on user age and role.
        """
        if age < 18:
            raise HTTPException(status_code=400, detail="User must be 18 or older to access election guidance.")
        
        try:
            flow_type = "Standard"
            guidance = get_rules_for_role(role)

            if age < 21 or role.lower() == "first_time_voter":
                flow_type = "Enhanced - First Time Voter"
                # Combine first-time rules with the specific role rules if different
                first_time_rules = get_rules_for_role("first_time_voter")
                guidance = list(set(first_time_rules + guidance)) # Unique steps

            elif role.lower() == "student":
                flow_type = "Simplified - Student"
                guidance = [f"Student Focus: {step}" for step in guidance]

            return {
                "flow_type": flow_type,
                "guidance": guidance
            }
        except Exception as e:
            logger.error(f"PersonalizationService Error: {str(e)}")
            raise HTTPException(
                status_code=500, 
                detail="An internal error occurred while generating the personalized flow. Please try again later."
            ) from e
