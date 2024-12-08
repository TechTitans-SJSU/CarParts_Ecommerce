# services/queue/consumer.py
import json
import logging
import pika
from config.settings import Config
from services.email.email_service import EmailService
from utils.decorators import retry

logger = logging.getLogger(__name__)

class RabbitMQConsumer:
    def __init__(self):
        self.config = Config()
        self.email_service = EmailService()
        self.connection = None
        self.channel = None
        self.connect()
    
    @retry(exceptions=(pika.exceptions.AMQPError,))
    def connect(self):
        try:
            # Close existing connection if any
            if self.connection is not None:
                try:
                    self.connection.close()
                except Exception as e:
                    logger.warning(f"Error closing existing connection: {e}")

            # Create credentials
            credentials = pika.PlainCredentials(
                self.config.RABBITMQ_USER,
                self.config.RABBITMQ_PASS
            )

            # Connect to RabbitMQ
            self.connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=self.config.RABBITMQ_HOST,
                    port=self.config.RABBITMQ_PORT,
                    credentials=credentials,
                    virtual_host='/'
                )
            )
            
            # Create channel
            self.channel = self.connection.channel()
            
            # First, try to delete the existing queue if it exists
            try:
                self.channel.queue_delete(queue=self.config.RABBITMQ_QUEUE)
                logger.info(f"Deleted existing queue: {self.config.RABBITMQ_QUEUE}")
            except Exception as e:
                logger.debug(f"Queue deletion skipped: {e}")

            # Declare queue with consistent settings
            self.channel.queue_declare(
                queue=self.config.RABBITMQ_QUEUE,
                durable=True,
                exclusive=False,
                auto_delete=False,
                arguments=None
            )
            
            # Set QoS
            self.channel.basic_qos(prefetch_count=1)
            
            logger.info("Successfully connected to RabbitMQ")
            
        except Exception as e:
            logger.error(f"Failed to connect to RabbitMQ: {e}")
            raise

    def process_message(self, ch, method, properties, body):
        try:
            logger.debug(f"Received message body: {body}")
            order_data = json.loads(body)
            logger.debug(f"Parsed order data: {order_data}")
            
            self.email_service.send_order_confirmation(order_data)
            ch.basic_ack(delivery_tag=method.delivery_tag)
            logger.info(f"Successfully processed order {order_data.get('order_id')}")
        except Exception as e:
            logger.error(f"Failed to process message: {e}")
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)

    def start_consuming(self):
        try:
            self.channel.basic_consume(
                queue=self.config.RABBITMQ_QUEUE,
                on_message_callback=self.process_message
            )
            logger.info("Started consuming messages")
            self.channel.start_consuming()
        except Exception as e:
            logger.error(f"Error while consuming messages: {e}")
            raise
    def shutdown(consumer):
        try:
            if consumer and consumer.connection:
                consumer.connection.close()
            logger.info("Cleaned up RabbitMQ consumer")
        except Exception as e:
            logger.error(f"Error during shutdown: {e}")