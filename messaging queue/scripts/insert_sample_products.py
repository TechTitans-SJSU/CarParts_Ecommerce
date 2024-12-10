import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db_connector import DatabaseConnection
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def insert_sample_products():
    db = DatabaseConnection()

    products = [
        ('Laptop', 999.99, 50),
        ('Smartphone', 699.99, 100),
        ('Headphones', 149.99, 200),
        ('Tablet', 449.99, 75),
        ('Smartwatch', 299.99, 150),
        ('Wireless Mouse', 29.99, 300),
        ('Keyboard', 89.99, 200),
        ('Monitor', 349.99, 80),
        ('Printer', 199.99, 60),
        ('External SSD', 129.99, 150)
    ]

    try:
        with db.get_connection() as conn:
            with conn.cursor() as cur:
                # Insert products
                cur.executemany(
                    """
                    INSERT INTO products (name, price, inventory)
                    VALUES (%s, %s, %s)
                    """,
                    products
                )
                conn.commit()
        logger.info(f"Successfully inserted {len(products)} sample products")
    except Exception as e:
        logger.error(f"Failed to insert sample products: {e}")
        raise

if __name__ == "__main__":
    insert_sample_products()