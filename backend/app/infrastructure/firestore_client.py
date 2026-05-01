from google.cloud import firestore
from app.core.config import settings
from app.core.logging import logger
from datetime import datetime

class FirestoreClient:
    """
    Firestore client for storing and retrieving user sessions.
    """
    def __init__(self):
        try:
            if settings.FIRESTORE_PROJECT_ID:
                self.db = firestore.AsyncClient(project=settings.FIRESTORE_PROJECT_ID)
            else:
                # Fallback to default credentials if project ID is not explicitly set
                self.db = firestore.AsyncClient()
            logger.info("Firestore client initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize Firestore client: {e}")
            self.db = None

    async def save_user_query(self, user_id: str, query: str, response: dict) -> None:
        """
        Saves a user query and the AI's response to Firestore.
        """
        if not self.db:
            logger.warning("Firestore client is not initialized. Skipping save.")
            return

        try:
            doc_ref = self.db.collection("sessions").document(user_id)
            query_data = {
                "question": query,
                "answer": response.get("answer", ""),
                "timestamp": datetime.utcnow()
            }
            
            # Ensure document exists and then update queries array
            await doc_ref.set({"last_updated": datetime.utcnow()}, merge=True)
            await doc_ref.update({
                "queries": firestore.ArrayUnion([query_data])
            })
            logger.info(f"Successfully saved query for user: {user_id}")
        except Exception as e:
            logger.error(f"Error saving query to Firestore for user {user_id}: {e}")

    async def get_user_history(self, user_id: str) -> list:
        """
        Retrieves the history of queries for a user from Firestore.
        """
        if not self.db:
            logger.warning("Firestore client is not initialized. Returning empty history.")
            return []

        try:
            doc_ref = self.db.collection("sessions").document(user_id)
            doc = await doc_ref.get()
            
            if doc.exists:
                return doc.to_dict().get("queries", [])
            return []
        except Exception as e:
            logger.error(f"Error retrieving history from Firestore for user {user_id}: {e}")
            return []
