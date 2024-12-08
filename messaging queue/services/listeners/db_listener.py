# services/listeners/db_listener.py
import time
import json
import logging
import select
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from config.settings import Config
from services.queue.publisher import RabbitMQPublisher
from utils.decorators import retry

logger = logging.getLogger(__name__)

class DatabaseListener:
    def __init__(self):
        self.config = Config()
        self.publisher = RabbitMQPublisher()
        self.conn = None

    def handle_notification(self, payload):
        try:
            # Implement notification handling logic
            order_data = json.loads(payload)
            self.publisher.publish(order_data)
            logger.info(f"Processed notification: {order_data}")
        except Exception as e:
            logger.error(f"Error handling notification: {e}")

    @retry(exceptions=(psycopg2.Error,))
    def start_listening(self):
        while True:
            try:
                connection_string = (
                    f"postgresql://{self.config.DB_USER}:{self.config.DB_PASSWORD}"
                    f"@{self.config.DB_HOST}/{self.config.DB_NAME}?sslmode={self.config.DB_SSL_MODE}"
                )
                
                self.conn = psycopg2.connect(connection_string)
                self.conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
                
                with self.conn.cursor() as cur:
                    cur.execute("LISTEN userorders_notifications;")
                    logger.info("Listening for database notifications...")
                    
                    while True:
                        if select.select([self.conn], [], [], 60) != ([], [], []):
                            self.conn.poll()
                            while self.conn.notifies:
                                notify = self.conn.notifies.pop(0)
                                self.handle_notification(notify.payload)
                        
            except Exception as e:
                logger.error(f"Database listener error: {e}")
                if self.conn:
                    try:
                        self.conn.close()
                    except:
                        pass
                time.sleep(5)  # Wait before reconnecting