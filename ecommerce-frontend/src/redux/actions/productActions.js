import axios from 'axios';

// Action to fetch all products
export const fetchProducts = () => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_PRODUCTS_REQUEST' });

        const { data } = await axios.get('/api/products'); // Adjust if the endpoint is different
        dispatch({
            type: 'FETCH_PRODUCTS_SUCCESS',
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: 'FETCH_PRODUCTS_FAIL',
            payload: error.message,
        });
    }
};

// Action to fetch product details by ID
export const fetchProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_PRODUCT_DETAILS_REQUEST' });

        const { data } = await axios.get(`/api/products/${id}`); // Adjust if the endpoint is different
        dispatch({
            type: 'FETCH_PRODUCT_DETAILS_SUCCESS',
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: 'FETCH_PRODUCT_DETAILS_FAIL',
            payload: error.message,
        });
    }
};
