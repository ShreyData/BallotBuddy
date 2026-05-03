import pytest
from app.services.timeline_service import TimelineService

@pytest.fixture
def timeline_service():
    return TimelineService()

@pytest.mark.asyncio
async def test_get_timeline_success(timeline_service):
    response = await timeline_service.get_timeline()
    assert "events" in response
    assert len(response["events"]) > 0
    # Check for some common election phases
    phases = [event["phase"] for event in response["events"]]
    assert any("Announcement" in p or "Schedule" in p for p in phases)
    assert any("Counting" in p or "Results" in p for p in phases)

@pytest.mark.asyncio
async def test_get_timeline_structure(timeline_service):
    response = await timeline_service.get_timeline()
    for event in response["events"]:
        assert "phase" in event
        assert "description" in event
