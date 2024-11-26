import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/category';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.category_id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Link
            to={`/products/category/${category.category_id}`}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow block"
            >
            <h2 className="text-xl font-semibold mb-2">{category.category_name}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;