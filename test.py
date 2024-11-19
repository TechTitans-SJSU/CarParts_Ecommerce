import requests

# # Test connection
# response = requests.get("http://localhost:8000/test-connection")
# print("Connection test:", response.json())

# # Get schema
# response = requests.get("http://localhost:8000/schema")
# print("Schema:", response.json())

# Make a query
response = requests.post(
    "http://localhost:8000/query",
    json={"question": "Give me the email of the users whose orders are not yet delivered ?"}
)
print("Query result:", response.json())
