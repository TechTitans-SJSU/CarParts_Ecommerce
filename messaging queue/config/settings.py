# config/settings.py
from dataclasses import dataclass
import os
from dotenv import load_dotenv

load_dotenv()

@dataclass
class Config:
     # Database
    DB_HOST: str = os.getenv('DB_HOST', 'ep-bold-union-a698c6lj.us-west-2.aws.neon.tech')
    DB_NAME: str = os.getenv('DB_NAME', 'car_parts_db')
    DB_USER: str = os.getenv('DB_USER', 'car_parts_db_owner')
    DB_PASSWORD: str = os.getenv('DB_PASSWORD', '0F4QXKRPmHBW')
    DB_PORT: int = int(os.getenv('DB_PORT', 5432))
    DB_SSL_MODE: str = os.getenv('DB_SSL_MODE', 'require')
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}/{self.DB_NAME}?sslmode={self.DB_SSL_MODE}"


    
    # RabbitMQ settings remain unchanged
    RABBITMQ_HOST: str = os.getenv('RABBITMQ_HOST', 'localhost')
    RABBITMQ_PORT: int = int(os.getenv('RABBITMQ_PORT', 5672))
    RABBITMQ_USER: str = os.getenv('RABBITMQ_USER', 'guest')
    RABBITMQ_PASS: str = os.getenv('RABBITMQ_PASS', 'guest')
    RABBITMQ_QUEUE: str = 'userorders_notifications'
    
    # Email settings remain unchanged
    SMTP_SERVER: str = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT: int = int(os.getenv('SMTP_PORT', 587))
    EMAIL_USER: str = os.getenv('EMAIL_USER')
    EMAIL_PASSWORD: str = os.getenv('EMAIL_PASSWORD')
    
    # Application settings remain unchanged
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')