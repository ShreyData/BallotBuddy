import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi import HTTPException
from app.services.ai_service import AiService

@pytest.fixture
def mock_ai_provider():
    return AsyncMock()

@pytest.fixture
def mock_cache_manager():
    cache = AsyncMock()
    cache.get.return_value = None
    return cache

@pytest.fixture
def mock_firestore_client():
    return AsyncMock()

@pytest.fixture
def ai_service(mock_ai_provider, mock_cache_manager, mock_firestore_client):
    return AiService(
        ai_provider=mock_ai_provider, 
        cache_manager=mock_cache_manager,
        firestore_client=mock_firestore_client
    )

@pytest.mark.asyncio
async def test_ask_question_valid(ai_service, mock_ai_provider, mock_firestore_client, mock_cache_manager):
    mock_ai_provider.generate_response.return_value = "This is an answer."
    mock_ai_provider.generate_embedding.return_value = [0.1, 0.2]
    mock_firestore_client.query_knowledge_base.return_value = ["Fact 1"]
    mock_cache_manager.get.return_value = None
    
    response = await ai_service.ask_question("test_user_id", "What is voting?")
    
    assert response["answer"] == "This is an answer."
    assert response["source"] == "gemini"
    mock_ai_provider.generate_embedding.assert_called_once()
    mock_firestore_client.query_knowledge_base.assert_called_once()
    mock_ai_provider.generate_response.assert_called_once()
    mock_firestore_client.save_user_query.assert_called_once()

@pytest.mark.asyncio
async def test_ask_question_empty(ai_service):
    with pytest.raises(HTTPException) as excinfo:
        await ai_service.ask_question("test_user_id", "")
    assert excinfo.value.status_code == 400

@pytest.mark.asyncio
async def test_ask_question_too_long(ai_service):
    long_question = "a" * 501
    with pytest.raises(HTTPException) as excinfo:
        await ai_service.ask_question("test_user_id", long_question)
    assert excinfo.value.status_code == 400

@pytest.mark.asyncio
async def test_ask_question_cache_hit(ai_service, mock_ai_provider, mock_cache_manager, mock_firestore_client):
    mock_cache_manager.get.return_value = "Cached answer"
    
    response = await ai_service.ask_question("test_user_id", "Cached question")
    
    assert response["answer"] == "Cached answer"
    assert response["source"] == "cache"
    mock_ai_provider.generate_response.assert_not_called()
    mock_firestore_client.save_user_query.assert_not_called()
