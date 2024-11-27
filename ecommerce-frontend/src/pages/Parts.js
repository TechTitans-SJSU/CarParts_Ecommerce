import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { cartService } from '../services/cart';
import { useCart } from '../context/CartContext';
import { partService } from '../services/parts';

const Parts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { productId } = useParams();
  const { cartItems, updateCart } = useCart();

  useEffect(() => {
    const fetchPartsByProduct = async () => {
      try {
        const response = await partService.getByProduct(productId);
        setParts(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartsByProduct();
  }, [productId]);

  const handleAddToCart = (part) => {
    // Add with initial quantity of 1
    const partWithQuantity = { ...part, quantity: 1 };
    const updatedCart = cartService.addToCart(partWithQuantity);
    updateCart(updatedCart);
  };

  const handleUpdateQuantity = (part, change) => {
    const currentQuantity = getItemQuantity(part.part_id);
    const newQuantity = currentQuantity + change;
    
    if (newQuantity <= 0) {
      const updatedCart = cartService.removeFromCart(part.part_id);
      updateCart(updatedCart);
      return;
    }

    const updatedCart = cartService.updateQuantity(part.part_id, newQuantity);
    updateCart(updatedCart);
  };

  const getItemQuantity = (partId) => {
    const cartItem = cartItems.find(item => item.part_id === partId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Parts</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {parts.map((part) => {
          const quantity = getItemQuantity(part.part_id);
          console.log(quantity);
          return (
            <div key={part.part_id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative pt-[100%]"> {/* Creates a square aspect ratio */}
                <img
                  src={`/images/${part.image_name}`}
                  alt={part.part_name}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/parts/default-part.jpg'; // Fallback image
                  }}
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{part.part_name}</h2>
                <p className="text-gray-600 mb-2">{part.description}</p>
                <p className="text-blue-600 font-medium mb-3">${part.price}</p>
                <div className="flex flex-col gap-2">
                  {quantity === 0 ? (
                    <button 
                      onClick={() => handleAddToCart(part)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-100 rounded p-2">
                      <button 
                        onClick={() => handleUpdateQuantity(part, -1)}
                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-medium mx-3">{quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(part, 1)}
                        className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Parts;