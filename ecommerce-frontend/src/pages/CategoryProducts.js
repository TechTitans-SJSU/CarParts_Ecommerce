import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/products';
import { Link } from 'react-router-dom';

const CategoryProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await productService.getByCategory(categoryId);
        setProducts(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categoryId]);


  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.product_id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Link
            to={`/parts/product/${product.product_id}`}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow block"
            >
            <h2 className="text-xl font-semibold mb-2">{product.product_name}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;