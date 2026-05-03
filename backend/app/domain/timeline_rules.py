from typing import Dict, List

ELECTION_TIMELINE: List[Dict[str, str]] = [
    {
        "phase": "Announcement & MCC",
        "description": "ECI announces dates; Model Code of Conduct comes into immediate effect.",
        "date": "2026-03-15"
    },
    {
        "phase": "Notification & Nomination",
        "description": "Official notification is issued; candidates file nominations and undergo scrutiny.",
        "date": "2026-03-22"
    },
    {
        "phase": "Campaigning",
        "description": "Candidates engage with voters; campaigning ends 48 hours before polling.",
        "date": "2026-04-10"
    },
    {
        "phase": "Polling",
        "description": "Voters cast ballots using EVM and VVPAT at designated polling stations.",
        "date": "2026-04-25"
    },
    {
        "phase": "Counting & Results",
        "description": "Votes are counted from EVMs and results are declared by the Returning Officer.",
        "date": "2026-05-15"
    }
]

def get_static_timeline() -> List[Dict[str, str]]:
    """
    Returns the standard election timeline phases.
    """
    return ELECTION_TIMELINE
