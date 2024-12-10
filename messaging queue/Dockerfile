FROM python:3.9-slim

# Set working directory
WORKDIR /app

COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Environment variables
ENV DB_HOST=ep-bold-union-a698c6lj.us-west-2.aws.neon.tech \
    DB_NAME=car_parts_db \
    DB_USER=car_parts_db_owner \
    RABBITMQ_HOST=host.docker.internal \
    RABBITMQ_PORT=5672 \
    SMTP_SERVER=smtp.gmail.com \
    SMTP_PORT=587

# Expose RabbitMQ port 5672 only
EXPOSE 5672

# Run the application
CMD ["python", "main.py"]

