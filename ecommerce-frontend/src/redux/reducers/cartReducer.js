const initialState = {
    cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItem = state.cartItems.find(
                (item) => item.id === action.payload.id
            );
            if (existingItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((item) =>
                        item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
                    ),
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, action.payload],
                };
            }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (item) => item.id !== action.payload
                ),
            };
        case 'UPDATE_CART_QUANTITY':
            return {
                ...state,
                cartItems: state.cartItems.map((item) =>
                    item.id === action.payload.productId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
        default:
            return state;
    }
};

export default cartReducer;
