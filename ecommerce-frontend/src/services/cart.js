export const cartService = {
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },
  
  addToCart: (part) => {
    const cart = cartService.getCart();
    const existingItem = cart.find(item => item.part_id === part.part_id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...part, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },
  
  removeFromCart: (partId) => {
    const cart = cartService.getCart();
    const updatedCart = cart.filter(item => item.part_id !== partId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return updatedCart;
  },
  
  updateQuantity: (partId, quantity) => {
    const cart = cartService.getCart();
    const item = cart.find(item => item.part_id === partId);
    if (item) {
      if (quantity <= 0) {
        return cartService.removeFromCart(partId);
      }
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    return cart;
  }
};
