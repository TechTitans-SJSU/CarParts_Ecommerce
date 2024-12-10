import psycopg2
from flask import Flask, render_template, jsonify
import redis
import os
from flask_cors import CORS
import ast
import json


app = Flask(__name__)
CORS(app)

DB_CONNECTION_STRING = os.getenv("NEON_DB_CONNECTION_STRING", "postgresql://car_parts_db_owner:0F4QXKRPmHBW@ep-bold-union-a698c6lj.us-west-2.aws.neon.tech/car_parts_db?sslmode=require")
REDIS_URL = "redis://default:dMVIwQgEv6p9YRVkiCL2JhkmHalBXI2v@redis-18397.c11.us-east-1-2.ec2.redns.redis-cloud.com:18397"

r = redis.from_url(REDIS_URL)

def get_db_connection():
    conn = psycopg2.connect(DB_CONNECTION_STRING)
    return conn

def fetch_trending_items():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT uoi.part_id, p.part_name, p.image_name, p.price, SUM(uoi.quantity) AS total_quantity
        FROM userorderitems uoi
        JOIN public."Parts" p ON uoi.part_id = p.part_id
        GROUP BY uoi.part_id, p.part_name, p.image_name, p.price
        ORDER BY total_quantity DESC
        LIMIT 10;
    """)

    trending_items = cur.fetchall()
    cur.close()
    conn.close()

    # Convert to list of dictionaries for JSON serialization
    trending_items_list = [
        {
            'part_id': item[0],
            'part_name': item[1],
            'image_name': item[2],
            'price': float(item[3]),
            'total_quantity': item[4]
        }
        for item in trending_items
    ]

    return trending_items_list

@app.route('/api/trending-products', methods=['GET'])
def get_trending_products():
    # Check if cached data exists
    cached_trending = r.get("trending_items")

    if cached_trending:
        trending_items_list = json.loads(cached_trending.decode('utf-8'))
    else:
        trending_items_list = fetch_trending_items()
        r.set("trending_items", json.dumps(trending_items_list), ex=600)  # Cache for 10 minutes

    return jsonify(trending_items_list)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)
