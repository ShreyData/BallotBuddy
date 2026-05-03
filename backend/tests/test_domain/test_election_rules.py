import pytest
from app.domain.election_rules import get_rules_for_role, ROLE_GUIDES

@pytest.mark.parametrize("role", ["voter", "student", "first_time_voter"])
def test_get_rules_for_existing_roles(role):
    rules = get_rules_for_role(role)
    assert len(rules) > 0
    assert rules == ROLE_GUIDES[role]

def test_get_rules_case_insensitivity():
    assert get_rules_for_role("VOTER") == ROLE_GUIDES["voter"]
    assert get_rules_for_role("Student") == ROLE_GUIDES["student"]

def test_get_rules_for_unknown_role():
    rules = get_rules_for_role("alien")
    assert len(rules) == 1
    assert "general election handbook" in rules[0]
