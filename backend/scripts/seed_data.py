import asyncio
import os
from google.cloud import firestore
from google.cloud.firestore_v1.vector import Vector
from google.genai import Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def seed_knowledge_base():
    """
    Seeds the Firestore 'election_facts' collection with grounded data and embeddings.
    """
    project_id = os.getenv("FIRESTORE_PROJECT_ID")
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not project_id or not api_key:
        print("Error: FIRESTORE_PROJECT_ID and GEMINI_API_KEY must be set in .env")
        return

    db = firestore.AsyncClient(project=project_id)
    ai_client = Client(api_key=api_key)
    
    facts = [
        "In India, any citizen aged 18 or older can vote if their name is on the Electoral Roll.",
        "The Election Commission of India (ECI) is the constitutional body that conducts all federal and state elections.",
        "Voter registration is done primarily through the NVSP (National Voters' Service Portal) or the 'Voter Helpline' app.",
        "Form 6 is the application for inclusion of name in the electoral roll for a new voter.",
        "Electronic Voting Machines (EVM) are used across all polling stations, accompanied by VVPAT (Voter Verifiable Paper Audit Trail).",
        "The Model Code of Conduct (MCC) comes into force immediately after the ECI announces the election schedule.",
        "Voters must present their EPIC (Voter ID) card or one of the 12 other approved photo ID documents at the polling booth.",
        "Indelible ink is applied to the left index finger of the voter as a mark of having cast their vote.",
        "NOTA (None of the Above) is an option on the EVM for voters who do not wish to vote for any candidate.",
        "The Returning Officer (RO) is responsible for the conduct of elections in a constituency and declares the results."
    ]

    print(f"Seeding {len(facts)} facts to Firestore collection 'election_facts'...")

    for fact in facts:
        # Generate embedding using Gemini
        try:
            result = ai_client.models.embed_content(
                model='text-embedding-004',
                contents=fact
            )
            embedding = result.embeddings[0].values
            
            # Save to Firestore
            doc_ref = db.collection("election_facts").document()
            await doc_ref.set({
                "content": fact,
                "embedding": Vector(embedding),
                "timestamp": firestore.SERVER_TIMESTAMP
            })
            print(f"✅ Seeded: {fact[:50]}...")
        except Exception as e:
            print(f"❌ Failed to seed fact: {e}")

    print("\nKnowledge base seeding complete.")
    print("NOTE: Ensure you have created a Vector Index in the Firebase/GCP Console for the 'election_facts' collection.")

if __name__ == "__main__":
    asyncio.run(seed_knowledge_base())
