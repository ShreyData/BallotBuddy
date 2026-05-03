import pytest
from unittest.mock import patch, AsyncMock, MagicMock
import io
import json

@pytest.mark.asyncio
async def test_ai_query_with_auth(client, mock_firebase_user):
    # Mocking singleton instances directly in deps
    mock_gemini = AsyncMock()
    mock_firestore = AsyncMock()
    mock_trans = MagicMock()
    mock_cache = AsyncMock()
    
    mock_gemini.generate_embedding.return_value = [0.1]
    mock_gemini.generate_response.return_value = json.dumps({
        "answer": "Test Answer", 
        "reasoning": "Test Reasoning", 
        "confidence_score": 0.99
    })
    mock_firestore.query_knowledge_base.return_value = ["Fact"]
    mock_cache.get.return_value = None
    mock_trans.detect_language.return_value = "en"
    
    with patch("app.api.deps._gemini_client", mock_gemini):
        with patch("app.api.deps._firestore_client", mock_firestore):
            with patch("app.api.deps._translation_client", mock_trans):
                with patch("app.api.deps._cache_manager", mock_cache):
                    
                    response = client.post(
                        "/api/v1/ai/query",
                        json={"question": "What is voting?"},
                        headers={"Authorization": "Bearer fake_token"}
                    )
                    
                    assert response.status_code == 200
                    data = response.json()
                    assert data["answer"] == "Test Answer"
                    assert data["reasoning"] == "Test Reasoning"

def test_ai_query_no_auth(client):
    response = client.post("/api/v1/ai/query", json={"question": "What is voting?"})
    assert response.status_code == 401
