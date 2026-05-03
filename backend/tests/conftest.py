import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def mock_firebase_user():
    with patch("firebase_admin.auth.verify_id_token") as mock:
        mock.return_value = {"uid": "test_user_123", "email": "test@example.com"}
        yield mock
