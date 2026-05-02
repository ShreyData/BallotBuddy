from typing import List, Dict

ELECTION_TIMELINE: List[Dict[str, str]] = [
    {
        "phase": "Announcement & MCC",
        "description": "ECI announces dates; Model Code of Conduct comes into immediate effect."
    },
    {
        "phase": "Notification & Nomination",
        "description": "Official notification is issued; candidates file nominations and undergo scrutiny."
    },
    {
        "phase": "Campaigning",
        "description": "Candidates engage with voters; campaigning ends 48 hours before polling."
    },
    {
        "phase": "Polling",
        "description": "Voters cast ballots using EVM and VVPAT at designated polling stations."
    },
    {
        "phase": "Counting & Results",
        "description": "Votes are counted from EVMs and results are declared by the Returning Officer."
    }
]

def get_static_timeline() -> List[Dict[str, str]]:
    """
    Returns the standard election timeline phases.
    """
    return ELECTION_TIMELINE
