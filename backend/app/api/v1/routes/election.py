from fastapi import APIRouter, Depends
from app.schemas.election import ElectionGuideRequest, ElectionGuideResponse, PersonalizedFlowRequest, PersonalizedFlowResponse
from app.services.election_service import ElectionService
from app.services.personalization_service import PersonalizationService
from app.api.deps import get_election_service, get_personalization_service, get_current_user_id

router = APIRouter()

@router.get('/guide', response_model=ElectionGuideResponse)
async def get_guide(
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
async def get_personalized_flow(
    request: PersonalizedFlowRequest,
    user_id: str = Depends(get_current_user_id),
    service: PersonalizationService = Depends(get_personalization_service)
):
    """
    Returns a personalized guidance flow based on age and role.
    """
    result = await service.get_personalized_flow(request.age, request.role)
    return result
