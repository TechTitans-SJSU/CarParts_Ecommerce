# Use a lightweight Python base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies required for psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create a Python virtual environment
RUN python -m venv /app/venv

# Activate the virtual environment and install dependencies
COPY requirements.txt .
RUN /app/venv/bin/pip install --no-cache-dir -r requirements.txt

# Copy the application files into the container
COPY app.py .
COPY .env .

# Expose the application port
EXPOSE 5001

# Use the virtual environment's Python as the default Python
ENV PATH="/app/venv/bin:$PATH"

# Set the default command to run the application
CMD ["python", "app.py"]
