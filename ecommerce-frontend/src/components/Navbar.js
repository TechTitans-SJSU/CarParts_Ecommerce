// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ShoppingCart, Search, LogOut } from 'lucide-react';
// import { useCart } from '../context/CartContext';
// import {KeycloakService} from '../config/keycloak';

// const Navbar = () => {

//   const { cartItems } = useCart();
//   const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   const handleLogout = () => {
//     KeycloakService.logout();
//   };

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 py-3">
//         <div className="flex justify-between items-center">
//           <Link to="/" className="text-xl font-bold">AutoParts</Link>
//           <div className="flex items-center space-x-6">
//             <form className="flex items-center">
//               <input
//                 type="text"
//                 placeholder="Search parts..."
//                 className="px-4 py-2 border rounded-l focus:outline-none"
//               />
//               <button className="px-4 py-2 bg-blue-500 text-white rounded-r">
//                 <Search size={20} />
//               </button>
//             </form>
//             <Link to="/cart" className="relative">
//               <ShoppingCart size={24} />
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
//                 {cartCount}
//               </span>
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="flex items-center text-gray-600 hover:text-red-500"
//             >
//               <LogOut size={24} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, LogOut, Bell } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { KeycloakService } from '../config/keycloak';

const Navbar = () => {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const unreadNotifications = 5;

  const handleLogout = () => {
    KeycloakService.logout();
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            AutoParts
          </Link>

          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search parts..."
              className="w-full max-w-lg px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500">
              <Search size={20} />
            </button>
          </div>
          {/* Icons */}
          <div className="flex items-center space-x-6">
              {/* Notifications */}
          <button className="relative p-2 hover:text-blue-500" aria-label="Notifications">
            <Bell size={24} />
            {unreadNotifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Power BI / Tableau Link */}
          <a
            href="https://public.tableau.com/app/profile/lakshmi.dogiparthy/viz/Book1_17327549682010/Dashboard1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-500 rounded-lg hover:bg-gray-100"
          >
            <span>Power BI</span>
          </a>
            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:text-blue-500">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-500 rounded-lg hover:bg-gray-100"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
