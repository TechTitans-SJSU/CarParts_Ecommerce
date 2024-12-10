from database.db_connector import DatabaseConnection
from database.models.order import Order
import logging

logger = logging.getLogger(__name__)

class OrderRepository:
    def __init__(self):
        self.db = DatabaseConnection()

    def create_order(self, user_data, total_amount, status='PENDING'):
        try:
            conn = self.db.get_connection()
            with conn.cursor() as cur:
                query = """
                    INSERT INTO userorders (
                        total_amount, payment_details, created_at, city,
                        zip_code, first_name, last_name, email, status,
                        user_id, shipping_address
                    ) VALUES (
                        %s, %s, CURRENT_TIMESTAMP, %s, %s, %s, %s, %s, %s, %s, %s
                    ) RETURNING *
                """
                cur.execute(query, (
                    total_amount,
                    user_data['payment_details'],
                    user_data['city'],
                    user_data['zip_code'],
                    user_data['first_name'],
                    user_data['last_name'],
                    user_data['email'],
                    status,
                    user_data['user_id'],
                    user_data['shipping_address']
                ))
                result = cur.fetchone()
                conn.commit()
                return Order.from_dict(result) if result else None
        except Exception as e:
            logger.error(f"Failed to create order: {e}")
            raise

    def get_order(self, order_id):
        try:
            conn = self.db.get_connection()
            with conn.cursor() as cur:
                query = """
                    SELECT *
                    FROM userorders
                    WHERE order_id = %s
                """
                cur.execute(query, (order_id,))
                result = cur.fetchone()
                return Order.from_dict(result) if result else None
        except Exception as e:
            logger.error(f"Failed to get order {order_id}: {e}")
            raise

    def update_order_status(self, order_id, status):
        try:
            conn = self.db.get_connection()
            with conn.cursor() as cur:
                query = """
                    UPDATE userorders
                    SET status = %s
                    WHERE order_id = %s
                    RETURNING *
                """
                cur.execute(query, (status, order_id))
                result = cur.fetchone()
                conn.commit()
                return Order.from_dict(result) if result else None
        except Exception as e:
            logger.error(f"Failed to update order {order_id}: {e}")
            raise
    def get_order_with_items(self, order_id):
        try:
            with self.db.get_connection() as conn:
                with conn.cursor() as cur:
                    query = """
                        SELECT o.*, oi.quantity, oi.price, p.name
                        FROM userorders o
                        LEFT JOIN order_items oi ON o.id = oi.order_id
                        LEFT JOIN products p ON oi.product_id = p.id
                        WHERE o.id = %s
                    """
                    cur.execute(query, (order_id,))
                    order_data = cur.fetchone()

                    # Fetch order items
                    items_query = """
                        SELECT oi.quantity, oi.price, p.name
                        FROM order_items oi
                        JOIN products p ON oi.product_id = p.id
                        WHERE oi.order_id = %s
                    """
                    cur.execute(items_query, (order_id,))
                    items = cur.fetchall()

                    if order_data:
                        order_data['items'] = items
                    return order_data
        except Exception as e:
            logger.error(f"Failed to get order with items {order_id}: {e}")
            raise