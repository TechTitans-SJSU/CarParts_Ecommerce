# services/queue/publisher.py
import json
import logging
import pika
from config.settings import Config
from utils.decorators import retry

logger = logging.getLogger(__name__)

class RabbitMQPublisher:
    def __init__(self):
        self.config = Config()
        self.connection = None
        self.channel = None
        self.connect()
    
    @retry(exceptions=(pika.exceptions.AMQPError,))
    def connect(self):
        try:
            if self.connection is not None:
                try:
                    self.connection.close()
                except Exception as e:
                    logger.warning(f"Error closing existing connection: {e}")

            credentials = pika.PlainCredentials(
                self.config.RABBITMQ_USER,
                self.config.RABBITMQ_PASS
            )
            
            self.connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=self.config.RABBITMQ_HOST,
                    port=self.config.RABBITMQ_PORT,
                    credentials=credentials,
                    virtual_host='/'
                )
            )
            self.channel = self.connection.channel()
            
            # Declare queue with same settings as consumer
            self.channel.queue_declare(
                queue=self.config.RABBITMQ_QUEUE,
                durable=True,
                exclusive=False,
                auto_delete=False,
                arguments=None
            )
            logger.info("Successfully connected to RabbitMQ")
        except Exception as e:
            logger.error(f"Failed to connect to RabbitMQ: {e}")
            raise

    def publish(self, message):
        try:
            self.channel.basic_publish(
                exchange='',
                routing_key=self.config.RABBITMQ_QUEUE,
                body=json.dumps(message),
                properties=pika.BasicProperties(
                    delivery_mode=2  # make message persistent
                )
            )
            logger.info(f"Published message for order {message.get('order_id')}")
        except Exception as e:
            logger.error(f"Failed to publish message: {e}")
            self.connect()
            self.publish(message)