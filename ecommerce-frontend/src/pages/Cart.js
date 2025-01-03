import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, updateCart } = useCart();
  const navigate = useNavigate();

  const handleUpdateQuantity = (itemId, change) => {
    const updatedCart = cartItems.map(item => {
      if ((item.part_id === itemId)) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          return null;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean);

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    updateCart(updatedCart);
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item =>
      !(item.part_id === itemId)
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    updateCart(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemName = (item) => {
    return item.part_name;
  };

  const getItemId = (item) => {
    return item.part_id;
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-600"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="bg-white rounded-lg shadow-md">
        {cartItems.map((item) => {
          const itemId = getItemId(item);
          const itemName = getItemName(item);

          return (
            <div
              key={itemId}
              className="flex items-center border-b p-6 last:border-b-0"
            >
            <div className="w-24 h-24 flex-shrink-0 mr-6">
                <img
                src={`/images/${item.image_name}`}
                alt={itemName}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                e.target.src = '/images/default-part.jpg';
                }}
            />
          </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{itemName}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded px-2">
                  <button
                    onClick={() => handleUpdateQuantity(itemId, -1)}
                    className="p-1 hover:text-red-500"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(itemId, 1)}
                    className="p-1 hover:text-green-500"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(itemId)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold">${calculateTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </Link>
          <button
          onClick={() => navigate('/checkout')}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
          Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
