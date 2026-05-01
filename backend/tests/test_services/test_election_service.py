import pytest
from fastapi import HTTPException
from app.services.election_service import ElectionService

@pytest.fixture
def election_service():
    return ElectionService()

@pytest.mark.asyncio
async def test_get_election_guide_valid_role(election_service):
    response = await election_service.get_election_guide("voter")
    assert response["role"] == "voter"
    assert len(response["steps"]) > 0
    assert "Register" in response["steps"][0]

@pytest.mark.asyncio
async def test_get_election_guide_invalid_role(election_service):
    response = await election_service.get_election_guide("alien")
    assert response["role"] == "alien"
    # Domain rules return a default guide for unknown roles
    assert "Consult the general election handbook" in response["steps"][0]

@pytest.mark.asyncio
async def test_get_election_guide_empty_role(election_service):
    with pytest.raises(HTTPException) as excinfo:
        await election_service.get_election_guide("")
    assert excinfo.value.status_code == 400
