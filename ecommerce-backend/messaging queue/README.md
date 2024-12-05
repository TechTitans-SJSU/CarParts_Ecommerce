# Order Notification Service

A microservice that sends email confirmations for e-commerce orders using PostgreSQL triggers and RabbitMQ message queuing.

## Key Features
- Real-time order notifications
- Automated email confirmations
- Message queuing with RabbitMQ
- Timezone-aware timestamps (PST)

## Requirements
- Python 3.8+
- PostgreSQL (Neon Database)
- RabbitMQ Server
- SMTP Server

## Quick Start

### 1. Install dependencies:
```bash
pip install -r requirements.txt

### Start RabbitMQ server:
rabbitmq-server start

### Run the main service:
python main.py