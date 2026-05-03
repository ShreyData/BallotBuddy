from fastapi import APIRouter, Depends, Request

from app.api.deps import get_current_user_id, get_timeline_service
from app.core.limiter import limiter
from app.schemas.timeline import TimelineResponse
from app.services.timeline_service import TimelineService

router = APIRouter()

@router.get('/', response_model=TimelineResponse)
@limiter.limit("15/minute")
async def get_timeline(
    request: Request,
    user_id: str = Depends(get_current_user_id),
    service: TimelineService = Depends(get_timeline_service)
):
    """
    Retrieves the standard election timeline.
    """
    result = await service.get_timeline()
    return result
