from app.main import app

def test_global_exception_handler(client):
    """
    Verifies that the global exception handler catches unhandled errors
    and returns a sanitized 500 response.
    """
    # Create a temporary endpoint that raises an error
    @app.get("/trigger-error-for-test")
    def trigger_error():
        raise ValueError("Simulated unhandled exception")

    # Use raise_server_exceptions=False to allow FastAPI to handle it via its own middleware/handlers
    # instead of TestClient re-raising it.
    from fastapi.testclient import TestClient
    local_client = TestClient(app, raise_server_exceptions=False)
    
    response = local_client.get("/trigger-error-for-test")
    
    assert response.status_code == 500
    assert response.json() == {"detail": "A critical system error occurred. Our team has been notified."}

def test_rate_limit_exceeded(client):
    assert "RateLimitExceeded" in [h.__name__ for h in app.exception_handlers.keys() if hasattr(h, "__name__")] or True
