import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.repositories.order_repository import OrderRepository
from database.db_connector import DatabaseConnection
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_test_order(product_names):
    try:
        db = DatabaseConnection()
        repo = OrderRepository()

        conn = db.get_connection()
        with conn.cursor() as cur:
            total_price = 0
            products = []

            # Find all products using IN clause instead of ARRAY
            placeholders = ','.join(['%s'] * len(product_names))
            query = f"""
                SELECT id, name, price, inventory
                FROM products
                WHERE name IN ({placeholders})
            """
            cur.execute(query, product_names)
            products = cur.fetchall()

            if not products:
                logger.error("No valid products found")
                return

            total_price = sum(product['price'] for product in products)

            # Create order
            order = repo.create_order(
                customer_email="satvik.atmakuri9@gmail.com",
                order_total=total_price,
                status="PENDING"
            )

            # Create order items and update inventory
            for product in products:
                cur.execute("""
                    INSERT INTO order_items (order_id, product_id, quantity, price)
                    VALUES (%s, %s, %s, %s)
                """, (order.id, product['id'], 1, product['price']))

                cur.execute("""
                    UPDATE products
                    SET inventory = inventory - 1
                    WHERE id = %s
                """, (product['id'],))

            conn.commit()
            logger.info(f"Created order {order.id} with products: {', '.join(product_names)}")

    except Exception as e:
        logger.error(f"Failed to create order: {e}")
        raise

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python create_test_order.py 'Product1' 'Product2' ...")
        sys.exit(1)

    product_names = sys.argv[1:]
    create_test_order(product_names)