import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi import HTTPException
from app.services.ai_service import AiService

@pytest.fixture
def mock_ai_provider():
    return AsyncMock()

@pytest.fixture
def mock_cache_manager():
    cache = MagicMock()
    cache.get.return_value = None
    return cache

@pytest.fixture
def ai_service(mock_ai_provider, mock_cache_manager):
    return AiService(ai_provider=mock_ai_provider, cache_manager=mock_cache_manager)

@pytest.mark.asyncio
async def test_ask_question_valid(ai_service, mock_ai_provider):
    mock_ai_provider.generate_response.return_value = "This is an answer."
    
    response = await ai_service.ask_question("What is voting?")
    
    assert response["answer"] == "This is an answer."
    assert response["source"] == "gemini"
    mock_ai_provider.generate_response.assert_called_once()

@pytest.mark.asyncio
async def test_ask_question_empty(ai_service):
    with pytest.raises(HTTPException) as excinfo:
        await ai_service.ask_question("")
    assert excinfo.value.status_code == 400

@pytest.mark.asyncio
async def test_ask_question_too_long(ai_service):
    long_question = "a" * 501
    with pytest.raises(HTTPException) as excinfo:
        await ai_service.ask_question(long_question)
    assert excinfo.value.status_code == 400

@pytest.mark.asyncio
async def test_ask_question_cache_hit(ai_service, mock_ai_provider, mock_cache_manager):
    mock_cache_manager.get.return_value = "Cached answer"
    
    response = await ai_service.ask_question("Cached question")
    
    assert response["answer"] == "Cached answer"
    assert response["source"] == "cache"
    mock_ai_provider.generate_response.assert_not_called()
