from fastapi import APIRouter, Depends
from app.schemas.timeline import TimelineResponse
from app.services.timeline_service import TimelineService
from app.api.deps import get_timeline_service, get_current_user_id

router = APIRouter()

@router.get('/', response_model=TimelineResponse)
async def get_timeline(
    user_id: str = Depends(get_current_user_id),
    service: TimelineService = Depends(get_timeline_service)
):
    """
    Retrieves the standard election timeline.
    """
    result = await service.get_timeline()
    return result
