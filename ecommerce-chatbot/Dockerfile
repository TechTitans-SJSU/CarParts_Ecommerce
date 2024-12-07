FROM python:3.9-slim

WORKDIR /code

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY NLapi.py .

# Create environment file from build args
ARG DB_NAME
ARG DB_USER
ARG DB_PASSWORD
ARG DB_HOST
ARG DB_DIALECT
ARG OPENAI_API_KEY

# Create .env file during build
RUN echo "DB_NAME=${DB_NAME}" > .env && \
    echo "DB_USER=${DB_USER}" >> .env && \
    echo "DB_PASSWORD=${DB_PASSWORD}" >> .env && \
    echo "DB_HOST=${DB_HOST}" >> .env && \
    echo "DB_DIALECT=${DB_DIALECT}" >> .env && \
    echo "OPENAI_API_KEY=${OPENAI_API_KEY}" >> .env


# Set the port to 8004
CMD ["uvicorn", "NLapi:app", "--host", "0.0.0.0", "--port", "8004"]

# Expose the new port
EXPOSE 8004
