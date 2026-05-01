from typing import List, Dict

ELECTION_TIMELINE: List[Dict[str, str]] = [
    {
        "phase": "Registration",
        "description": "The period where eligible citizens sign up to be on the electoral roll."
    },
    {
        "phase": "Nomination",
        "description": "Candidates officially declare their intent to run for office."
    },
    {
        "phase": "Campaigning",
        "description": "Candidates present their platforms and engage with voters."
    },
    {
        "phase": "Voting",
        "description": "The day or period when ballots are cast by the electorate."
    },
    {
        "phase": "Counting & Certification",
        "description": "Ballots are tallied and results are verified and made official."
    }
]

def get_static_timeline() -> List[Dict[str, str]]:
    """
    Returns the standard election timeline phases.
    """
    return ELECTION_TIMELINE
