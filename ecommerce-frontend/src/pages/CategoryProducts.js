// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// //import { categoryService } from '../services/category';
// import { productService } from '../services/products';
// // import { toast } from 'react-hot-toast';
// // import { Plus, Minus, ShoppingCart } from 'lucide-react';
// // import { cartService } from '../services/cart';
// import { useCart } from '../context/CartContext';
// import { useNavigate, Link } from 'react-router-dom';
// import { partService } from '../services/parts';
// import axios from 'axios';

// const CategoryProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [parts, setParts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   //const [cartItems, setCartItems] = useState([]);
//   const { categoryId } = useParams();
//   const navigate = useNavigate();
//  // const { cartItems, updateCart } = useCart();

//   useEffect(() => {
//     const fetchProductsByCategory = async () => {
//       try {
//         // const response = await productService.getByCategory(categoryId);
//         // setProducts(response.data);
//         const response = await partService.getByProduct(productId);
//         setParts(response.data);
//       } catch (error) {
//         console.error('Error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductsByCategory();
//   }, [productId]);

//   // const handleAddToCart = (product) => {
//   //   try {
//   //     const updatedCart = cartService.addToCart(product);
//   //     setCartItems(updatedCart);
//   //     toast.success(`${product.product_name} added to cart`);
//   //   } catch (error) {
//   //     console.error('Error adding to cart:', error);
//   //     toast.error('Failed to add item to cart');
//   //   }
//   // };

//   // const handleAddToCart = (product) => {
//   //   const updatedCart = cartService.addToCart(product);
//   //   updateCart(updatedCart);
//   // };

//   // const handleUpdateQuantity = (product, change) => {
//   //   const currentQuantity = getItemQuantity(product.product_id);
//   //   const newQuantity = currentQuantity + change;
    
//   //   if (newQuantity <= 0) {
//   //     const updatedCart = cartService.removeFromCart(product.product_id);
//   //     updateCart(updatedCart);
//   //     return;
//   //   }

//   //   const updatedCart = cartService.updateQuantity(product.product_id, newQuantity);
//   //   updateCart(updatedCart);
//   // };

//   // const handleRemoveFromCart = (productId) => {
//   //   try {
//   //     const updatedCart = cartService.removeFromCart(productId);
//   //     setCartItems(updatedCart);
//   //     toast.success('Item removed from cart');
//   //   } catch (error) {
//   //     console.error('Error removing from cart:', error);
//   //     toast.error('Failed to remove item from cart');
//   //   }
//   // };

//   // const handleUpdateQuantity = (product, change) => {
//   //   try {
//   //     const currentQuantity = getItemQuantity(product.product_id);
//   //     const newQuantity = currentQuantity + change;
      
//   //     if (newQuantity <= 0) {
//   //       handleRemoveFromCart(product.product_id);
//   //       return;
//   //     }

//   //     const updatedCart = cartService.updateQuantity(product.product_id, newQuantity);
//   //     setCartItems(updatedCart);
//   //   } catch (error) {
//   //     console.error('Error updating quantity:', error);
//   //     toast.error('Failed to update quantity');
//   //   }
//   // };

//   // const getItemQuantity = (productId) => {
//   //   const item = cartItems.find(item => item.product_id === productId);
//   //   return item ? item.quantity : 0;
//   // };

//   const handleProductClick = (id) => {
//     navigate(`/products/parts/${id}`);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   // // // return (
//   // // //   <div className="max-w-7xl mx-auto px-4 py-8">
//   // // //   <h1 className="text-3xl font-bold mb-8">Category Products</h1>
//   // // //   <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//   // // //     {products.map((product) => {
//   // // //       // const quantity = getItemQuantity(product.product_id);
//   // // //       return (
//   // // //         <div key={product.product_id} className="bg-white rounded-lg shadow-md overflow-hidden">
//   // // //           <div className="p-4">
//   // // //             <h2 className="text-lg font-semibold mb-2">{product.product_name}</h2>
//   // // //             {/* <div className="flex flex-col gap-2">
//   // // //               {quantity === 0 ? (
//   // // //                 <button 
//   // // //                   onClick={() => handleAddToCart(product)}
//   // // //                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
//   // // //                 >
//   // // //                   <ShoppingCart size={20} />
//   // // //                   Add to Cart
//   // // //                 </button>
//   // // //               ) : (
//   // // //                 <div className="flex items-center justify-between bg-gray-100 rounded p-2">
//   // // //                   <button 
//   // // //                     onClick={() => handleUpdateQuantity(product, -1)}
//   // // //                     className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
//   // // //                   >
//   // // //                     <Minus size={16} />
//   // // //                   </button>
//   // // //                   <span className="font-medium mx-3">{quantity}</span>
//   // // //                   <button 
//   // // //                     onClick={() => handleUpdateQuantity(product, 1)}
//   // // //                     className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors"
//   // // //                   >
//   // // //                     <Plus size={16} />
//   // // //                   </button>
//   // // //                 </div>
//   // // //               )}
//   // // //             </div> */}
//   // // //           </div>
//   // // //         </div>
//   // // //       );
//   // //     })}
//   //   </div>
//   //   </div>
//   // );


//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Products</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {products.map((product) => (
//           <div
//             key={product.id}
//             onClick={() => handleProductClick(product.id)}
//             className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
//           >
//             <Link
//               to={`/products/${product.id}/parts`}
//               className="p-6 block"
//             >
//               <h2 className="text-xl font-semibold mb-2">{product.product_name}</h2>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

// };

// export default CategoryProducts;









import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
//import { categoryService } from '../services/category';
import { productService } from '../services/products';
import { useNavigate, Link } from 'react-router-dom';

const CategoryProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();
  const navigate = useNavigate();

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

  const handleProductClick = (id) => {
    navigate(`/parts/product/${id}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.product_id}
            onClick={() => handleProductClick(product.product_id)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            {/* <h2 className="text-xl font-semibold mb-2">{category.category_name}</h2> */}
            <Link
            to={`/parts/${product.product_id}`}
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