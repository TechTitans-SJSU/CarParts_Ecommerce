
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">CarPartsPro</Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/orders">Orders</Link></li>
                <li><Link to="/login">Login</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
