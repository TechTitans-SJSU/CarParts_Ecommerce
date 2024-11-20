import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';
import '../styles/Product.css';

function Product({ product }) {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart(product));
    };

    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <Link to={`/product/${product.id}`}>View Details</Link>
                <button onClick={handleAddToCart} className="add-to-cart-button">
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

export default Product;
