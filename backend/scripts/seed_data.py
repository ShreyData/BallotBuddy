import asyncio
import os
from google.cloud import firestore
from google.cloud.firestore_v1.vector import Vector
from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel
import vertexai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def seed_knowledge_base():
    """
    Seeds the Firestore 'election_facts' collection with grounded data and embeddings using Vertex AI.
    """
    project_id = os.getenv("FIRESTORE_PROJECT_ID")
    location = os.getenv("GCP_LOCATION", "us-central1")
    
    if not project_id:
        print("Error: FIRESTORE_PROJECT_ID must be set in .env")
        return

    # Initialize Vertex AI
    vertexai.init(project=project_id, location=location)
    model = TextEmbeddingModel.from_pretrained("text-multilingual-embedding-002")
    
    db = firestore.AsyncClient(project=project_id)
    
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

    print(f"Seeding {len(facts)} facts to Firestore collection 'election_facts' using Vertex AI...")

    # Vertex AI embeddings can be batched
    try:
        inputs = [TextEmbeddingInput(fact) for fact in facts]
        embeddings_response = model.get_embeddings(inputs)
        embeddings = [e.values for e in embeddings_response]
        
        for i, fact in enumerate(facts):
            doc_ref = db.collection("election_facts").document()
            await doc_ref.set({
                "content": fact,
                "embedding": Vector(embeddings[i]),
                "timestamp": firestore.SERVER_TIMESTAMP
            })
            print(f"✅ Seeded: {fact[:50]}...")
            
    except Exception as e:
        print(f"❌ Failed to seed facts: {e}")

    print("\nKnowledge base seeding complete.")
    print("NOTE: Ensure you have created a Vector Index in the Firebase/GCP Console for the 'election_facts' collection.")

if __name__ == "__main__":
    asyncio.run(seed_knowledge_base())
