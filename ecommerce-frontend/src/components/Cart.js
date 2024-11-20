import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCartQuantity } from '../redux/actions/cartActions';
import '../styles/Cart.css';

function Cart() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleQuantityChange = (productId, quantity) => {
        if (quantity > 0) {
            dispatch(updateCartQuantity(productId, quantity));
        }
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="cart">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            min="1"
                                            onChange={(e) =>
                                                handleQuantityChange(item.id, parseInt(e.target.value, 10))
                                            }
                                        />
                                    </td>
                                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                                    <td>
                                        <button onClick={() => handleRemove(item.id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="cart-total">
                        <h2>Total: ${totalPrice.toFixed(2)}</h2>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
