import logging
import threading
import signal
import sys
from services.listeners.db_listener import DatabaseListener
from services.queue.consumer import RabbitMQConsumer
from config.logging_config import setup_logging

# Setup logging first
setup_logging()
logger = logging.getLogger(__name__)

# Initialize services (for use in the signal handler)
consumer = None

def shutdown():
    """ Graceful shutdown logic to stop consumers and clean up resources. """
    try:
        # Stop consuming messages if consumer exists
        if consumer and hasattr(consumer, 'channel') and consumer.channel:
            logger.info("Stopping consumer channel...")
            consumer.channel.stop_consuming()
            logger.info("Consumer stopped successfully.")
        # Perform any other necessary cleanup here (e.g., database connections)
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")

def signal_handler(signum, frame):
    """ Handler for shutdown signals. """
    try:
        logger.info("Received shutdown signal. Cleaning up...")
        shutdown()
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")
    finally:
        sys.exit(0)

def main():
    global consumer
    try:
        # Register signal handlers
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
        
        # Initialize services
        db_listener = DatabaseListener()
        consumer = RabbitMQConsumer()
        
        # Start database listener in a separate thread
        listener_thread = threading.Thread(
            target=db_listener.start_listening,
            daemon=True
        )
        listener_thread.start()
        
        logger.info("Application started successfully")
        
        # Start consuming messages
        consumer.start_consuming()
        
    except Exception as e:
        logger.error(f"Application failed to start: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()