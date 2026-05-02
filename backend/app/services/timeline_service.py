from fastapi import HTTPException
from app.domain.timeline_rules import get_static_timeline
from app.core.logging import logger

class TimelineService:
    """
    Service class for handling election timeline logic.
    """
    def __init__(self):
        pass

    async def get_timeline(self) -> dict:
        """
        Retrieves the standard election timeline phases.
        """
        try:
            phases = get_static_timeline()
            return {
                "events": phases
            }
        except Exception as e:
            logger.error(f"TimelineService Error: {str(e)}")
            raise HTTPException(
                status_code=500, 
                detail="An internal error occurred while retrieving the election timeline. Please try again later."
            )
