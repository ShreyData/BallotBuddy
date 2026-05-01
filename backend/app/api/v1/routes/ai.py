from fastapi import APIRouter, Depends
from app.schemas.ai import AIQueryRequest, AIQueryResponse, MisinformationRequest, MisinformationResponse
from app.services.ai_service import AiService
from app.services.misinformation_service import MisinformationService
from app.api.deps import get_ai_service, get_misinformation_service

router = APIRouter()

@router.post('/query', response_model=AIQueryResponse)
async def ai_query(
    request: AIQueryRequest,
    service: AiService = Depends(get_ai_service)
):
    """
    General AI query endpoint for election-related questions.
    """
    result = await service.ask_question(request.question)
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
