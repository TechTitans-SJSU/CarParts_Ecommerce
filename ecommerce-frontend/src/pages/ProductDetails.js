import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProductDetails } from '../redux/actions/productActions';
import '../styles/ProductDetails.css';

function ProductDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { productDetails, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProductDetails(id));
    }, [dispatch, id]);

    if (loading) return <p>Loading product details...</p>;
    if (error) return <p>Error: {error}</p>;

    if (!productDetails) return <p>No product details available.</p>;

    return (
        <div className="product-details">
            <h1>{productDetails.name}</h1>
            <img src={productDetails.image} alt={productDetails.name} />
            <p>{productDetails.description}</p>
            <p>Price: ${productDetails.price.toFixed(2)}</p>
        </div>
    );
}

export default ProductDetails;
