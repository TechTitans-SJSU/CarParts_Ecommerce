import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';

const Navbar = () => {
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
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;