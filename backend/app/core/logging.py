import logging
import sys
from pythonjsonlogger import jsonlogger

def setup_logging():
    logger = logging.getLogger("ballotbuddy")
    logger.setLevel(logging.INFO)
    
    # Check if handlers already exist to avoid duplicate logs in some environments
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        # Structured JSON format compatible with Cloud Logging
        formatter = jsonlogger.JsonFormatter(
            '%(asctime)s %(levelname)s %(name)s %(message)s %(route)s %(status)s %(user_id)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    return logger

logger = setup_logging()
