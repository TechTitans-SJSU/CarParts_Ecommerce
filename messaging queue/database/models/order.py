from datetime import datetime

class Order:
    def __init__(self, order_id, user_id, total_amount, payment_details,
                 city, zip_code, first_name, last_name, email, status,
                 shipping_address, created_at=None):
        self.order_id = order_id
        self.user_id = user_id
        self.total_amount = total_amount
        self.payment_details = payment_details
        self.city = city
        self.zip_code = zip_code
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.status = status
        self.shipping_address = shipping_address
        self.created_at = created_at or datetime.now()

    @classmethod
    def from_dict(cls, data):
        if not data:
            return None

        return cls(
            order_id=data['order_id'],
            user_id=data['user_id'],
            total_amount=data['total_amount'],
            payment_details=data['payment_details'],
            city=data['city'],
            zip_code=data['zip_code'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            status=data['status'],
            shipping_address=data['shipping_address'],
            created_at=data['created_at']
        )

    def to_dict(self):
        return {
            'order_id': self.order_id,
            'user_id': self.user_id,
            'total_amount': self.total_amount,
            'payment_details': self.payment_details,
            'city': self.city,
            'zip_code': self.zip_code,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'status': self.status,
            'shipping_address': self.shipping_address,
            'created_at': self.created_at
        }