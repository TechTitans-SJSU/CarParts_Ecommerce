const initialState = {
    products: [],
    productDetails: null,
    loading: false,
    error: null,
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_PRODUCTS_REQUEST':
        case 'FETCH_PRODUCT_DETAILS_REQUEST':
            return {
                ...state,
                loading: true,
            };
        case 'FETCH_PRODUCTS_SUCCESS':
            return {
                ...state,
                products: action.payload,
                loading: false,
            };
        case 'FETCH_PRODUCT_DETAILS_SUCCESS':
            return {
                ...state,
                productDetails: action.payload,
                loading: false,
            };
        case 'FETCH_PRODUCTS_FAIL':
        case 'FETCH_PRODUCT_DETAILS_FAIL':
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export default productReducer;
