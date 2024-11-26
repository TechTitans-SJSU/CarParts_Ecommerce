import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Category from './pages/Category';
import CategoryProducts from './pages/CategoryProducts';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './config/keycloak';
import { CartProvider } from './context/CartContext';
import Parts from './pages/Parts';

const App = () => {
  // const [authenticated, setAuthenticated] = useState(false);

  // useEffect(() => {
  //   initKeycloak()
  //     .then((auth) => {
  //       setAuthenticated(auth);
  //     })
  //     .catch(console.error);
  // }, []);

  // if (!authenticated) return <div>Loading...</div>;

  return (
    <ReactKeycloakProvider authClient={keycloak}
    initOptions={{
      onLoad: 'login-required',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256'
    }}>
    <CartProvider>
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* <Route path="/login" element={<Login />} /> */}
          <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Category />} />
          <Route path="/products/category/:categoryId" element={<CategoryProducts />} />
          {/* <Route path="/parts/product/:productId" element={<Parts />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} /> */}
          <Route path="/parts/product/:productId" element={<Parts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
    </CartProvider>
  </ReactKeycloakProvider>
  );
};

export default App;