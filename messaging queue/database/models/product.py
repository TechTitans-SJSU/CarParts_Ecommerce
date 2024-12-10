from dataclasses import dataclass
from decimal import Decimal

@dataclass
class Product:
    id: int
    name: str
    price: Decimal
    inventory: int

    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            id=data['id'],
            name=data['name'],
            price=Decimal(str(data['price'])),
            inventory=data['inventory']
        )