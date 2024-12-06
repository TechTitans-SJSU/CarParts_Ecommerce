// import React from 'react';
// import { Link } from 'react-router-dom';

// const Home = () => {

// const categories = [
//     'Category',
// ];
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <div className="text-center mb-12">
//         <h1 className="text-4xl font-bold mb-4">Welcome to AutoParts</h1>
//         <p className="text-gray-600">Your one-stop shop for quality car parts</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {categories.map((category) => (
//           <Link
//             key={category}
//             to="/category"
//             className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
//           >
//             <h2 className="text-xl font-semibold mb-2">{category}</h2>
//             <p className="text-gray-600">Browse our selection of {category.toLowerCase()}</p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const categories = ['Category'];

  useEffect(() => {
    // Fetch trending products from the backend
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/trending-products');
        console.log('Trending Products:', response.data);
        setTrendingProducts(response.data);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to AutoParts</h1>
        <p className="text-gray-600">Your one-stop shop for quality car parts</p>
      </div>

      {/* Categories Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
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

            {/* Trending Products Section */}
            <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Trending Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProducts.map((product) => (
            <div key={product.part_id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              {product.image_name && (
                <img
                  src={`/images/${product.image_name}`}
                  alt={product.part_name}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
              )}
              <h3 className="text-xl font-medium mb-2">{product.part_name}</h3>
              <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Orders: {product.total_quantity}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;
