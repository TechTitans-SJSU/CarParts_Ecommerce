import React, { useState, useEffect } from 'react';
import { productService } from '../services/products';
import { useNavigate, Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll();
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }


return (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8">Products</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <Link
            to={`/products/${product.id}/parts`}
            className="p-6 block"
          >
            <h2 className="text-xl font-semibold mb-2">{product.product_name}</h2>
          </Link>
        </div>
      ))}
    </div>
  </div>
);

};

export default Products;