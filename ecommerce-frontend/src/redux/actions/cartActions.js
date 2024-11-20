export const addToCart = (product) => (dispatch, getState) => {
    dispatch({
        type: 'ADD_TO_CART',
        payload: { ...product, quantity: 1 },
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (productId) => (dispatch, getState) => {
    dispatch({
        type: 'REMOVE_FROM_CART',
        payload: productId,
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const updateCartQuantity = (productId, quantity) => (dispatch, getState) => {
    dispatch({
        type: 'UPDATE_CART_QUANTITY',
        payload: { productId, quantity },
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};
