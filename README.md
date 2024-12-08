# E-commerce Application with Chatbot Integration

This repository contains an e-commerce application which sells car parts, with an integrated chatbot feature. The application’s components are containerized using Docker and automatically built and deployed with CircleCI.

## Project Components

### Frontend Application
- Located in `/ecommerce-frontend`
- Built with Reactjs
- Includes automated testing suite

### Backend Service
- Located in `/ecommerce-backend`
- Built with Node.js
- OpenAPI spec based REST API - Swagger
- Includes automated testing suite

### Natural Language Processing API (Chatbot)
- Located in `/ecommerce-chatbot`
- Built with Python 3.9
- Integrates with OpenAI API
- Requires database configuration

### Redis Application
- Located in `/redis`
- Built with Python 3.9
- Handles caching and data persistence

### RabbitMq
- Located in `/messaging queue`
- Used for message queuing to enable reliable and asynchronous communication between components

### Observability & Metrics
- Locatied in `/observability`
- These tools provide real-time observability and analytics for the infrastructure and application

## Environment Variables

### Frontend application
```
REACT_APP_KEYCLOAK_URL
REACT_APP_KEYCLOAK_REALM
REACT_APP_KEYCLOAK_CLIENT_ID
```

### Backend application
```
KEYCLOAK_URL
KEYCLOAK_REALM
KEYCLOAK_CLIENT_ID
KEYCLOAK_CLIENT_SECRET
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_DIALECT
```

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

### RabbitMq Requirements
```
DB_HOST
DB_NAME
DB_USER
DB_PASSWORD
DB_PORT
DB_SSL_MODE
RABBITMQ_HOST
RABBITMQ_PORT
RABBITMQ_USER
RABBITMQ_PASS
SMTP_SERVER
SMTP_PORT
EMAIL_USER
EMAIL_PASSWORD
LOG_LEVEL
```

## CI/CD Pipeline

This project uses CircleCI for continuous integration and deployment. The pipeline consists of five main jobs:

1. `frontend-build`: Builds and tests the frontend application
2. `backend-build`: Builds and tests the backend service
3. `nlapi-build`: Builds the NL API service with required environment configuration
4. `redis-app-build`: Builds the Redis application with required environment configuration
5. `rabbitmq-build`: Builds the RabbitMq application with required environment configuration

Each job:
- Sets up the appropriate Docker environment
- Installs dependencies
- Runs tests (where applicable)
- Builds Docker images
- Pushes images to Docker Hub

## Getting Started

1. Clone the repository
2. For local development, create `.env` files in the respective directories with the required environment variables
3. Install dependencies for each component:
   ```bash
   docker-compose up --build
   ```

### Start RabbitMQ server:
```
rabbitmq-server start
```

## Docker Images

All components are containerized and available on Docker Hub under the `aishwaryamurahari` organization:
- Frontend: `aishwaryamurahari/ecommerce-frontend:1.0`
- Backend: `aishwaryamurahari/ecommerce-backend:1.0`
- NL API: `aishwaryamurahari/nlapi:latest`
- Redis App: `aishwaryamurahari/redis-app:latest`
- RabbitMq: `aishwaryamurahari/rabbit_mq_app:latest`

## Key Features
- Ecommerce web page for Car parts
- SSO using Keycloak
- Two factor autentication using Keycloak
- Federated signup using Facebook
- SQL Database using Neon
- OPENAPI spec based REST API - Swagger
- Automated email confirmations
- Message queuing with RabbitMQ
- Cache using Redis
- Observability & Metrics with Grafana/Prometheus
- CI/CD with CircleCI
- BI Dashboard with Tableau
- LLM Chatbot
