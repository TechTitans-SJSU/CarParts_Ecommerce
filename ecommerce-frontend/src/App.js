
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderHistory from './pages/OrderHistory';
import { useDispatch } from 'react-redux';

// function App() {
//     const { keycloak, initialized } = useKeycloak();

//     if (!initialized) {
//         return <div>Loading...</div>;
//     }

//     if (!keycloak.authenticated) {
//         return <div>Not authenticated</div>;
//     }
function App({ keycloak }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (keycloak.authenticated) {
            // You can dispatch actions to store user info in Redux
            dispatch({
                type: 'SET_USER',
                payload: {
                    username: keycloak.tokenParsed?.preferred_username,
                    roles: keycloak.realmAccess?.roles || [],
                    token: keycloak.token
                }
            });
        }
    }, [keycloak.authenticated, dispatch]);

    if (!keycloak.authenticated) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/orders" element={<OrderHistory />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
