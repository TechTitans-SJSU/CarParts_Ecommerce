import psycopg2
from flask import Flask, render_template
import redis
import os

app = Flask(__name__)

# PostgreSQL connection details (Neon)
DB_CONNECTION_STRING = os.getenv("NEON_DB_CONNECTION_STRING", "postgresql://car_parts_db_owner:0F4QXKRPmHBW@ep-bold-union-a698c6lj.us-west-2.aws.neon.tech/car_parts_db?sslmode=require")

# Redis connection string
REDIS_URL = "redis://default:dMVIwQgEv6p9YRVkiCL2JhkmHalBXI2v@redis-18397.c11.us-east-1-2.ec2.redns.redis-cloud.com:18397"

# Initialize Redis client
r = redis.from_url(REDIS_URL)

# Initialize PostgreSQL connection
def get_db_connection():
    conn = psycopg2.connect(DB_CONNECTION_STRING)
    return conn

# Function to fetch trending items from PostgreSQL database
def fetch_trending_items():
    conn = get_db_connection()
    cur = conn.cursor()

    # Query to get the trending items based on the quantity ordered
    cur.execute("""
        SELECT part_id, SUM(quantity) AS total_quantity
        FROM userorderitems
        GROUP BY part_id
        ORDER BY total_quantity DESC
        LIMIT 10;
    """)

    trending_items = cur.fetchall()
    cur.close()
    conn.close()
    
    return trending_items

@app.route('/')
def index():
    # Check if cached data exists
    cached_trending = r.get("trending_items")
    
    if cached_trending:
        # If data exists in cache, use it
        trending_items_list = eval(cached_trending.decode('utf-8'))
    else:
        # If data does not exist in cache, fetch from DB and cache the result
        trending_items_list = fetch_trending_items()
        r.set("trending_items", str(trending_items_list), ex=600)  # Cache for 10 minutes
    
    return render_template("index.html", trending_items=trending_items_list)

if __name__ == '__main__':
    app.run(debug=True)
