from typing import List, Dict

ROLE_GUIDES: Dict[str, List[str]] = {
    "voter": [
        "Register on NVSP: Apply via Form 6 on the Voters' Service Portal (voters.eci.gov.in).",
        "Check Electoral Roll: Verify your name in the Voter List using your EPIC number.",
        "Locate Polling Station: Use the ECI 'Voter Helpline' app to find your specific booth.",
        "Booth Process: First Officer checks name/ID, Second Officer inks finger, Third Officer checks ink.",
        "Vote on EVM: Press the blue button next to your candidate's symbol on the EVM; verify the slip in the VVPAT window."
    ],
    "student": [
        "Eligibility: Ensure you are 18 on the qualifying date (Jan 1, Apr 1, Jul 1, or Oct 1).",
        "Registration: Register at your place of ordinary residence (Hostel or Home, but only one).",
        "EPIC Card: Ensure you have your Elector Photo Identity Card or one of the 12 alternative IDs.",
        "ECI Resources: Follow 'SVEEP' (Systematic Voters' Education and Electoral Participation) for awareness."
    ],
    "first_time_voter": [
        "Application: Submit Form 6 online or to your Booth Level Officer (BLO).",
        "ID Verification: Receive your EPIC card; check for any errors in name or address immediately.",
        "Polling Day: Witness the EVM Mock Poll (optional) and cast your first vote securely.",
        "Confidentiality: Remember that your vote is secret; do not take photos inside the polling booth."
    ]
}

def get_rules_for_role(role: str) -> List[str]:
    """
    Returns a list of step-by-step instructions for a given role.
    """
    return ROLE_GUIDES.get(role.lower(), ["Consult the general election handbook for guidance."])
