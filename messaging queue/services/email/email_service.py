import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
from pathlib import Path
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from config.settings import Config
from utils.decorators import retry
from database.db_connector import DatabaseConnection
import traceback

logger = logging.getLogger(__name__)

from datetime import datetime
import pytz

def format_date(d):
    """Format datetime to Pacific Time"""
    try:
        if isinstance(d, str):
            # Parse the timestamp with microseconds
            d = datetime.strptime(d, "%Y-%m-%dT%H:%M:%S.%f%z")
        
        if isinstance(d, datetime):
            # Convert to Pacific Time
            pacific_tz = pytz.timezone('America/Los_Angeles')
            d = d.astimezone(pacific_tz)
            return d.strftime('%B %d, %Y %I:%M %p %Z')
        return str(d)
    except ValueError:
        # Fallback for different format
        try:
            if isinstance(d, str):
                d = datetime.fromisoformat(d)
                pacific_tz = pytz.timezone('America/Los_Angeles')
                d = d.astimezone(pacific_tz)
                return d.strftime('%B %d, %Y %I:%M %p %Z')
        except ValueError:
            return str(d)

def format_price(p):
    """Explicitly defined function to format price"""
    try:
        return f"${float(p):.2f}" if p is not None else '$0.00'
    except (ValueError, TypeError):
        return '$0.00'

class EmailService:
    def __init__(self):
        self.config = Config()
        template_dir = Path(__file__).parent / 'templates'
        self.template_env = Environment(
            loader=FileSystemLoader(str(template_dir)),
            extensions=['jinja2.ext.debug']
        )
        self.db = DatabaseConnection()
    
    def get_order_items(self, order_id):
        try:
            conn = self.db.get_connection()
            with conn.cursor() as cur:
                query = """
                    SELECT order_item_id, order_id, product_id, quantity, price
                    FROM public."OrderItems"
                    WHERE order_id = %s
                """
                cur.execute(query, (order_id,))
                items = [
                    {
                        'order_item_id': item['order_item_id'],
                        'order_id': item['order_id'],
                        'product_id': item['product_id'],
                        'quantity': item['quantity'],
                        'price': item['price']
                    }
                    for item in cur.fetchall()
                ]
                return items
        except Exception as e:
            logger.error(f"Failed to fetch order items for Order {order_id}: {e}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return []

    def calculate_order_total(self, order_items):
        total = sum(item['quantity'] * float(item['price']) for item in order_items)
        return total

    def format_order_data(self, order_data):
        try:
            order_id = order_data.get('order_id')
            if not order_id:
                raise ValueError("Order ID is required")

            items = self.get_order_items(order_id) or []
            total_amount = self.calculate_order_total(items)

            formatted_data = {
                'id': order_id,
                'user_id': order_data.get('user_id'),
                'total_amount': float(order_data.get('total_amount', 0)),  # Now calculated from items
                'payment_details': order_data.get('payment_details', ''),
                'city': order_data.get('city', ''),
                'zip_code': order_data.get('zip_code', ''),
                'first_name': order_data.get('first_name', ''),
                'last_name': order_data.get('last_name', ''),
                'email': order_data.get('email', ''),
                'status': order_data.get('status', 'UNKNOWN'),
                'shipping_address': order_data.get('shipping_address', ''),
                'created_at': order_data.get('created_at'),
                'items': items
            }

            logger.info(f"Formatted Order Data: {formatted_data}")
            return formatted_data
        except Exception as e:
            logger.error(f"Order Data Formatting Error: {e}")
            logger.error(traceback.format_exc())
            raise

    def create_email_message(self, order_data):
        try:
            formatted_order = self.format_order_data(order_data)
            
            order_dict = {
                'id': formatted_order.get('id'),
                'user_id': formatted_order.get('user_id'),
                'first_name': formatted_order.get('first_name'),
                'last_name': formatted_order.get('last_name'),
                'email': formatted_order.get('email'),
                'order_total': formatted_order.get('total_amount'),  # Changed to match template
                'payment_details': formatted_order.get('payment_details'),
                'city': formatted_order.get('city'),
                'zip_code': formatted_order.get('zip_code'),
                'shipping_address': formatted_order.get('shipping_address'),
                'status': formatted_order.get('status'),
                'created_at': formatted_order.get('created_at'),
                'order_items': formatted_order.get('items', [])
            }

            template_context = {
                'order': order_dict,
                'formatted_date': format_date,
                'format_price': format_price,
                'now': datetime.now()
            }

            template = self.template_env.get_template('order_confirmation.html')
            html_content = template.render(**template_context)
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f"Order Confirmation #{order_dict['id']}"
            msg['From'] = self.config.EMAIL_USER
            msg['To'] = order_dict['email']
            msg.attach(MIMEText(html_content, 'html'))
            
            return msg
        except Exception as e:
            logger.error(f"Failed to create email message for order {order_data.get('order_id')}: {e}")
            raise

    @retry(exceptions=(smtplib.SMTPException,))
    def send_order_confirmation(self, order_data):
        """
        Send order confirmation email with comprehensive error handling
        
        Uses retry decorator for SMTP connection errors
        """
        try:
            msg = self.create_email_message(order_data)
            
            with smtplib.SMTP(self.config.SMTP_SERVER, self.config.SMTP_PORT) as server:
                server.starttls()
                server.login(self.config.EMAIL_USER, self.config.EMAIL_PASSWORD)
                server.send_message(msg)
            
            logger.info(f"Order Confirmation Email Sent: Order {order_data.get('order_id', 'Unknown')}")
            
        except Exception as e:
            logger.error(f"Email Sending Failed: Order {order_data.get('order_id', 'Unknown')}")
            logger.error(f"Error Details: {e}")
            logger.error(traceback.format_exc())
            raise