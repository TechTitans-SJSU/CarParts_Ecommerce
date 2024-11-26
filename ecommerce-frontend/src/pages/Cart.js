// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Trash2 } from 'lucide-react';

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);

//   const removeFromCart = (id) => {
//     setCartItems(cartItems.filter(item => item.id !== id));
//   };

//   const updateQuantity = (id, newQuantity) => {
//     setCartItems(cartItems.map(item =>
//       item.id === id ? { ...item, quantity: newQuantity } : item
//     ));
//   };

//   const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
//       {console.log(cartItems)}
//       {cartItems.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
//           <Link to="/products" className="text-blue-500 hover:underline">
//             Continue Shopping
//           </Link>
//         </div>
//       ) : (
//         <>
//           <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
//             {cartItems.map((item) => (
//               <div key={item.id} className="flex items-center p-6 border-b">
//                 <img
//                   src={item.image_url}
//                   alt={item.name}
//                   className="w-24 h-24 object-cover rounded"
//                 />
//                 <div className="flex-1 ml-6">
//                   <h2 className="text-lg font-semibold">{item.name}</h2>
//                   <p className="text-gray-600">${item.price}</p>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <input
//                     type="number"
//                     min="1"
//                     value={item.quantity}
//                     onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
//                     className="w-20 px-3 py-2 border rounded"
//                   />
//                   <button
//                     onClick={() => removeFromCart(item.id)}
//                     className="text-red-500 hover:text-red-600"
//                   >
//                     <Trash2 size={20} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex justify-between mb-6">
//               <span className="text-lg font-semibold">Total:</span>
//               <span className="text-2xl font-bold">${total.toFixed(2)}</span>
//             </div>
//             <Link
//               to="/checkout"
//               className="block w-full bg-blue-500 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-600"
//             >
//               Proceed to Checkout
//             </Link>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Cart;


import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateCart } = useCart();

  const handleUpdateQuantity = (productId, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.product_id === productId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          return null; // Will be filtered out
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean); // Remove null items

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    updateCart(updatedCart);
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.product_id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    updateCart(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  console.log(cartItems);
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
        {cartItems.map((item) => (
          <div 
            key={item.product_id} 
            className="flex items-center border-b p-6 last:border-b-0"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{item.product_name}</h3>
              <p className="text-gray-600">${item.price}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded px-2">
                <button
                  onClick={() => handleUpdateQuantity(item.product_id, -1)}
                  className="p-1 hover:text-red-500"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.product_id, 1)}
                  className="p-1 hover:text-green-500"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => handleRemoveItem(item.product_id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
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
          <Link
            to="/checkout"
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
