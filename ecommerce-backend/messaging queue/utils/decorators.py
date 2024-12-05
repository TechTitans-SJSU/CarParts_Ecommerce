# utils/decorators.py
import logging
import time
from functools import wraps

logger = logging.getLogger(__name__)

def retry(exceptions, total_tries=4, initial_wait=0.5, backoff_factor=2):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            wait = initial_wait
            tries = 0
            
            while True:
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    tries += 1
                    if tries == total_tries:
                        logger.error(f"Failed after {total_tries} tries: {str(e)}")
                        raise
                    
                    logger.warning(f"Retry {tries}/{total_tries} after {wait}s: {str(e)}")
                    time.sleep(wait)
                    wait *= backoff_factor
            
        return wrapper
    return decorator