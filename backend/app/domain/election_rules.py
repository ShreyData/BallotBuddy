from typing import List, Dict

ROLE_GUIDES: Dict[str, List[str]] = {
    "voter": [
        "Register to vote: Ensure you are on the electoral roll.",
        "Verify ID: Check which forms of identification are required at your polling station.",
        "Vote: Cast your ballot in person, by mail, or via proxy.",
        "Track results: Monitor official channels for certified election outcomes."
    ],
    "student": [
        "Check eligibility: Confirm if you can vote at your home address or term-time address.",
        "Register: Register at your chosen address (you can be registered at both, but only vote once).",
        "Research: Use non-partisan guides to understand candidate platforms.",
        "Vote: Participate in the democratic process."
    ],
    "first_time_voter": [
        "Understand the process: Read the 'Introduction to Elections' guide.",
        "Register: Submit your application early.",
        "ID Preparation: Get a voter ID if you don't have another valid form.",
        "Locate Polling Station: Find your specific voting location in advance."
    ]
}

def get_rules_for_role(role: str) -> List[str]:
    """
    Returns a list of step-by-step instructions for a given role.
    """
    return ROLE_GUIDES.get(role.lower(), ["Consult the general election handbook for guidance."])
