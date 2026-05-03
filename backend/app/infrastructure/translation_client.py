from typing import Optional

from google.cloud import translate_v3 as translate

from app.core.config import settings
from app.core.logging import logger


class TranslationClient:
    """
    Google Cloud Translation API implementation (v3) for multi-language support.
    Fully asynchronous to prevent event loop blocking.
    """
    def __init__(self):
        try:
            self.client = translate.TranslationServiceAsyncClient()
            self.parent = f"projects/{settings.FIRESTORE_PROJECT_ID}/locations/global"
            logger.info("TranslationClient (v3) initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize Translation client: {e}")
            self.client = None

    async def translate_text(self, text: str, target_language: str = "en") -> str:
        """
        Translates text to the target language asynchronously.
        """
        if not self.client:
            return text
        
        try:
            response = await self.client.translate_text(
                request={
                    "parent": self.parent,
                    "contents": [text],
                    "mime_type": "text/plain",
                    "target_language_code": target_language,
                }
            )
            return response.translations[0].translated_text
        except Exception as e:
            logger.error(f"Translation error: {e}")
            return text

    async def detect_language(self, text: str) -> Optional[str]:
        """
        Detects the language of the input text asynchronously.
        """
        if not self.client:
            return None
        
        try:
            response = await self.client.detect_language(
                request={
                    "parent": self.parent,
                    "content": text,
                    "mime_type": "text/plain",
                }
            )
            # v3 returns a list of detected languages
            if response.languages:
                return response.languages[0].language_code
            return None
        except Exception as e:
            logger.error(f"Language detection error: {e}")
            return None
