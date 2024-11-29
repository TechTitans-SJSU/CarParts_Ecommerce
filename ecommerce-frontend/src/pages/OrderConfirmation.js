import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
      <p className="text-xl text-gray-600 mb-8">Your order has been placed successfully.</p>
      <Link 
        to="/"
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmation;