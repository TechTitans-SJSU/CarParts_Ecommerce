FROM python:3.9-slim

WORKDIR /code

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY NLapi.py .
COPY .env .

# Set the port to 8004
CMD ["uvicorn", "NLapi:app", "--host", "0.0.0.0", "--port", "8004"]

# Expose the new port
EXPOSE 8004
