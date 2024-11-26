import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

const categories = [
    'Category',
];
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to AutoParts</h1>
        <p className="text-gray-600">Your one-stop shop for quality car parts</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category}
            to="/category"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{category}</h2>
            <p className="text-gray-600">Browse our selection of {category.toLowerCase()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;