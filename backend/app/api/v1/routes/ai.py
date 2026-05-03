from fastapi import APIRouter, Depends, File, Request, UploadFile

from app.api.deps import get_ai_service, get_current_user_id, get_misinformation_service
from app.core.limiter import limiter
from app.schemas.ai import (
    AIQueryRequest,
    AIQueryResponse,
    MisinformationRequest,
    MisinformationResponse,
)
from app.services.ai_service import AiService
from app.services.misinformation_service import MisinformationService

router = APIRouter()

@router.post('/query', response_model=AIQueryResponse)
@limiter.limit("5/minute")
async def ai_query(
    request: Request,
    ai_request: AIQueryRequest,
    user_id: str = Depends(get_current_user_id),
    service: AiService = Depends(get_ai_service)
):
    """
    Processes an election-related question using AI with grounded context.
    """
    result = await service.ask_question(user_id, ai_request.question)
    return result

@router.post('/check-claim', response_model=MisinformationResponse)
@limiter.limit("5/minute")
async def check_claim(
    request: Request,
    misinfo_request: MisinformationRequest,
    service: MisinformationService = Depends(get_misinformation_service)
):
    """
    Verifies a claim against potential misinformation.
    """
    result = await service.check_claim(misinfo_request.claim)
    return result

@router.post('/analyze-voter-slip')
@limiter.limit("3/minute")
async def analyze_voter_slip(
    request: Request,
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id),
    service: AiService = Depends(get_ai_service)
):
    """
    Analyzes an uploaded voter slip or ID using Gemini Vision.
    """
    contents = await file.read()
    result = await service.analyze_document(user_id, contents, file.content_type)
    return result
