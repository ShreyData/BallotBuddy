from fastapi import APIRouter, Depends, Request

from app.api.deps import get_current_user_id, get_election_service, get_personalization_service
from app.core.limiter import limiter
from app.schemas.election import (
    ElectionGuideResponse,
    PersonalizedFlowRequest,
    PersonalizedFlowResponse,
)
from app.services.election_service import ElectionService
from app.services.personalization_service import PersonalizationService

router = APIRouter()

@router.get('/guide', response_model=ElectionGuideResponse)
@limiter.limit("10/minute")
async def get_guide(
    request: Request,
    role: str,
    user_id: str = Depends(get_current_user_id),
    service: ElectionService = Depends(get_election_service)
):
    """
    Retrieves a step-by-step election guide based on user role.
    """
    result = await service.get_election_guide(role)
    return result

@router.post('/personalized-flow', response_model=PersonalizedFlowResponse)
@limiter.limit("10/minute")
async def get_personalized_flow(
    request: Request,
    flow_request: PersonalizedFlowRequest,
    user_id: str = Depends(get_current_user_id),
    service: PersonalizationService = Depends(get_personalization_service)
):
    """
    Returns a personalized guidance flow based on age and role.
    """
    result = await service.get_personalized_flow(flow_request.age, flow_request.role)
    return result
