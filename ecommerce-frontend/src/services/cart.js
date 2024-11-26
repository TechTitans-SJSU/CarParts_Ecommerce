export const cartService = {
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },
  
  addToCart: (product) => {
    const cart = cartService.getCart();
    const existingItem = cart.find(item => item.product_id === product.product_id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },
  
  removeFromCart: (productId) => {
    const cart = cartService.getCart();
    const updatedCart = cart.filter(item => item.product_id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return updatedCart;
  },
  
  updateQuantity: (productId, quantity) => {
    const cart = cartService.getCart();
    const item = cart.find(item => item.product_id === productId);
    if (item) {
      if (quantity <= 0) {
        return cartService.removeFromCart(productId);
      }
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    return cart;
  }
};
