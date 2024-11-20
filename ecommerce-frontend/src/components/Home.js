
import React, { useEffect, useState } from 'react';
import Product from './Product';
import '../styles/Home.css';

function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch products from the backend
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="home">
            <h1>Welcome to CarPartsPro</h1>
            <div className="products">
                {products.map((product) => (
                    <Product key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default Home;
