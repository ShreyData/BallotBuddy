from fastapi import APIRouter, Depends
from app.schemas.timeline import TimelineResponse
from app.services.timeline_service import TimelineService
from app.api.deps import get_timeline_service

router = APIRouter()

@router.get('/', response_model=TimelineResponse)
async def get_timeline(
    service: TimelineService = Depends(get_timeline_service)
):
    """
    Retrieves the standard election timeline.
    """
    result = await service.get_timeline()
    return result
