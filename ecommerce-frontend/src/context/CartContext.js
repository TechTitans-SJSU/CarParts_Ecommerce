import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartService } from '../services/cart';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(cartService.getCart());
  }, []);

  const updateCart = (newCart) => {
    setCartItems(newCart);
  };

  return (
    <CartContext.Provider value={{ cartItems, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
