import React, { useState, useEffect } from 'react';
import { productService } from '../services/products';
import { useNavigate, Link } from 'react-router-dom';
//import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
       // const response = await axios.get('/api/products');
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

  // const handleProductClick = (id) => {
  //   navigate(`/products/parts/${id}`);
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Car Parts</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.map((product) => (
//           <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//             <img
//               src={product.image_url}
//               alt={product.name}
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4">
//               <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
//               <p className="text-gray-600 mb-2">{product.description}</p>
//               <div className="flex justify-between items-center">
//                 <span className="text-xl font-bold">${product.price}</span>
//                 <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

// return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Car Parts</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products && products.length > 0 ? (
//           products.map((product) => (
//             <div key={product.product_id} className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold mb-2">{product.product_name}</h2>
//                 <p className="text-gray-600 mb-2">Category: {product.Category?.category_name}</p>
//                 <div className="flex justify-between items-center">
//                   <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div>No products found</div>
//         )}
//       </div>
//     </div>
//   );

return (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8">Products</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          // onClick={() => handleProductClick(product.id)}
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