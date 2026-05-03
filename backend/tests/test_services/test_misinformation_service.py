import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi import HTTPException
from app.services.misinformation_service import MisinformationService
from app.schemas.ai import MisinformationResult

@pytest.fixture
def mock_ai_provider():
    return AsyncMock()

@pytest.fixture
def misinfo_service(mock_ai_provider):
    return MisinformationService(ai_provider=mock_ai_provider)

@pytest.mark.asyncio
async def test_check_claim_valid(misinfo_service, mock_ai_provider):
    # Setup mock response
    mock_ai_provider.generate_response.return_value = '{"is_true": true, "explanation": "This is true."}'
    
    result = await misinfo_service.check_claim("Voters can use Aadhar as ID.")
    assert result["claim"] == "Voters can use Aadhar as ID."
    assert result["is_true"] is True
    assert result["explanation"] == "This is true."

@pytest.mark.asyncio
async def test_check_claim_empty(misinfo_service):
    with pytest.raises(HTTPException) as excinfo:
        await misinfo_service.check_claim("")
    assert excinfo.value.status_code == 400

@pytest.mark.asyncio
async def test_check_claim_too_long(misinfo_service):
    long_claim = "a" * 501
    with pytest.raises(HTTPException) as excinfo:
        await misinfo_service.check_claim(long_claim)
    assert excinfo.value.status_code == 400

@pytest.mark.asyncio
async def test_check_claim_ai_error(misinfo_service, mock_ai_provider):
    mock_ai_provider.generate_response.side_effect = Exception("AI failure")
    with pytest.raises(HTTPException) as excinfo:
        await misinfo_service.check_claim("test")
    assert excinfo.value.status_code == 500
