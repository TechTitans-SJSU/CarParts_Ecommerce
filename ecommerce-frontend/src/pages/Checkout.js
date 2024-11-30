import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { checkoutService } from '../services/checkout';
//import { useKeycloak } from '@react-keycloak/web';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, updateCart } = useCart();
  //const [isProcessing, setIsProcessing] = useState(false);
  //const { keycloak } = useKeycloak(); // Access Keycloak instance
 
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    shipping_address: '',
    city: '',
    zip_code: '',
    cardNumber: '',
    expiryDate: '',
  });

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //setIsProcessing(true);

    try {
      const formattedItems = cartItems.map(item => ({
        part_id: item.part_id,
        quantity: item.quantity,
        price: parseFloat(item.price.toString()) 
      }));

      console.log('Cart Items:', formattedItems);
      const orderData = {
        items: formattedItems,
        total_amount: parseFloat(calculateTotal().toFixed(2)),
        shippingDetails: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          shipping_address: formData.shipping_address,
          city: formData.city,
          zip_code: formData.zip_code
        },
        payment_details: {
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
        }
      };
      console.log('Sending order data:', JSON.stringify(orderData, null, 2));
      
      const response = await checkoutService.postcheckoutService(orderData);

      // if (!response.ok) {
      //   throw new Error('Order submission failed');
      // }
      
    //   const data = await response.json()
       console.log(response);

      // Clear cart and update context
      localStorage.removeItem('cart');
      updateCart([]);
      
      // Navigate to confirmation page
      navigate('/order-confirmation');
      
    } catch (error) {
      console.error('Error:', error);
    } 

    
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.part_id} className="flex justify-between">
              <span>{item.part_name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-4 font-bold">
            <span>Total: ${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code</label>
              <input
                type="text"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;