import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/actions/productActions';
import Product from '../components/Product';
import './Products.css';

function Products() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="products-page">
            <h1>Our Products</h1>
            <div className="products-grid">
                {products.map((product) => (
                    <Product key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default Products;
