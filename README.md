# E-commerce Application with Chatbot Integration

This repository contains a microservices-based e-commerce application with an integrated chatbot feature. The project consists of multiple components that are automatically built and deployed using CircleCI.

## Project Components

### Frontend Application
- Located in `/ecommerce-frontend`
- Built with Node.js
- Includes automated testing suite
- Docker image: `aishwaryamurahari/ecommerce-frontend:1.0`

### Backend Service
- Located in `/ecommerce-backend`
- Built with Node.js
- Includes automated testing suite
- Docker image: `aishwaryamurahari/ecommerce-backend:1.0`

### Natural Language Processing API (Chatbot)
- Located in `/ecommerce-chatbot`
- Built with Python 3.9
- Integrates with OpenAI API
- Requires database configuration
- Docker image: `aishwaryamurahari/nlapi:latest`

### Redis Application
- Located in `/redis`
- Built with Python 3.9
- Handles caching and data persistence
- Docker image: `aishwaryamurahari/redis-app:latest`

## Environment Variables

### NL API Requirements
```
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_DIALECT
OPENAI_API_KEY
```

### Redis App Requirements
```
DB_HOST
DB_NAME
DB_USER
DB_PASSWORD
DB_PORT
DB_SSL_MODE
REDIS_HOST
REDIS_PORT
LOG_LEVEL
```

## CI/CD Pipeline

This project uses CircleCI for continuous integration and deployment. The pipeline consists of four main jobs:

1. `frontend-build`: Builds and tests the frontend application
2. `backend-build`: Builds and tests the backend service
3. `nlapi-build`: Builds the NL API service with required environment configuration
4. `redis-app-build`: Builds the Redis application with required environment configuration

Each job:
- Sets up the appropriate Docker environment
- Installs dependencies
- Runs tests (where applicable)
- Builds Docker images
- Pushes images to Docker Hub

## Getting Started

1. Clone the repository
2. Set up required environment variables in your CircleCI project settings
3. For local development, create `.env` files in the respective directories with the required environment variables
4. Install dependencies for each component:
   ```bash
   # Frontend
   cd ecommerce-frontend
   npm install

   # Backend
   cd ecommerce-backend
   npm install

   # NL API
   cd ecommerce-chatbot
   pip install -r requirements.txt

   # Redis App
   cd redis
   pip install -r requirements.txt
   ```

## Docker Images

All components are containerized and available on Docker Hub under the `aishwaryamurahari` organization:
- Frontend: `aishwaryamurahari/ecommerce-frontend:1.0`
- Backend: `aishwaryamurahari/ecommerce-backend:1.0`
- NL API: `aishwaryamurahari/nlapi:latest`
- Redis App: `aishwaryamurahari/redis-app:latest`

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

```bash
pip install -r requirements.txt

Start RabbitMQ server:
rabbitmq-server start

Run the main service:
python main.py

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
