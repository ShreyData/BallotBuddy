from fastapi import APIRouter, Depends
from app.schemas.ai import AIQueryRequest, AIQueryResponse, MisinformationRequest, MisinformationResponse
from app.services.ai_service import AiService
from app.services.misinformation_service import MisinformationService
from app.api.deps import get_ai_service, get_misinformation_service, get_current_user_id

router = APIRouter()

@router.post('/query', response_model=AIQueryResponse)
async def ai_query(
    request: AIQueryRequest,
    user_id: str = Depends(get_current_user_id),
    service: AiService = Depends(get_ai_service)
):
    """
    General AI query endpoint for election-related questions.
    Now includes user_id tracking from headers.
    """
    result = await service.ask_question(user_id, request.question)
    return result

@router.post('/check-claim', response_model=MisinformationResponse)
async def check_claim(
    request: MisinformationRequest,
    service: MisinformationService = Depends(get_misinformation_service)
):
    """
    Verifies a claim against potential misinformation.
    """
    result = await service.check_claim(request.claim)
    return result
