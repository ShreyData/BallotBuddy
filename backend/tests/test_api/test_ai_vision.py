import pytest
from unittest.mock import patch, AsyncMock
import io

@pytest.mark.asyncio
async def test_analyze_voter_slip(client, mock_firebase_user):
    mock_gemini = AsyncMock()
    mock_gemini.generate_response.return_value = "Detailed analysis"
    
    with patch("app.api.deps._gemini_client", mock_gemini):
        # Simulate file upload
        file_content = b"fake image content"
        files = {"file": ("voter_slip.jpg", io.BytesIO(file_content), "image/jpeg")}
        
        response = client.post(
            "/api/v1/ai/analyze-voter-slip",
            files=files,
            headers={"Authorization": "Bearer fake_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["analysis"] == "Detailed analysis"
        assert data["document_type"] == "detected"
