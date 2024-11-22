import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/products';
//import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        //const response = await axios.get(`/api/products/${id}`);
        const response = await productService.get(`/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-xl">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Specifications:</h2>
            <ul className="list-disc list-inside">
              {product.specifications?.map((spec, index) => (
                <li key={index} className="text-gray-600">{spec}</li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <span className="text-2xl font-bold">${product.price}</span>
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <label className="font-medium">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-3 py-2 border rounded"
            />
          </div>
          <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;