import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import {KeycloakService} from '../config/keycloak';

const Navbar = () => {

  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    KeycloakService.logout();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">AutoParts</Link>
          <div className="flex items-center space-x-6">
            <form className="flex items-center">
              <input
                type="text"
                placeholder="Search parts..."
                className="px-4 py-2 border rounded-l focus:outline-none"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-r">
                <Search size={20} />
              </button>
            </form>
            <Link to="/cart" className="relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-500"
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;