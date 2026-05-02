from fastapi import HTTPException
from app.domain.election_rules import get_rules_for_role
from app.core.logging import logger

class ElectionService:
    """
    Service class for handling election guide logic.
    """
    def __init__(self):
        pass

    async def get_election_guide(self, role: str) -> dict:
        """
        Retrieves a step-by-step election guide based on the user's role.
        """
        if not role:
            raise HTTPException(status_code=400, detail="Role must be provided.")
        
        try:
            steps = get_rules_for_role(role)
            return {
                "role": role,
                "steps": steps
            }
        except Exception as e:
            logger.error(f"ElectionService Error: {str(e)}")
            raise HTTPException(
                status_code=500, 
                detail="An internal error occurred while retrieving the election guide. Please try again later."
            )
