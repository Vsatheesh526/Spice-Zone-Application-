import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CartPage.css";

const CartPage = ({
  cart,
  handleRemoveFromCart,
  handleUpdateQty,
  handleClearCart
}) => {
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    handleClearCart();
  };

  return (
    <div className="cart-fullpage">
      {orderPlaced ? (
        <div className="order-success-bg">
          <div className="sprinkle sprinkle1"></div>
          <div className="sprinkle sprinkle2"></div>
          <div className="sprinkle sprinkle3"></div>
          <div className="sprinkle sprinkle4"></div>
          <div className="sprinkle sprinkle5"></div>
          <div className="order-success-content">
            <div className="order-success-tick">✔️</div>
            <h2>Order Placed Successfully!</h2>
            <Link to="/" className="order-success-close">Go to Home</Link>
          </div>
        </div>
      ) : (
        <>
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul className="cart-list">
              {cart.map((item, idx) => (
                <li key={idx} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <strong>{item.name}</strong>
                    <div className="cart-qty-controls">
                      <button className="qty-btn" onClick={() => handleUpdateQty(item.name, -1)} disabled={item.qty <= 1}>-</button>
                      <span className="qty-display">{item.qty}</span>
                      <button className="qty-btn" onClick={() => handleUpdateQty(item.name, 1)}>+</button>
                    </div>
                    <div>Price: ${item.price}</div>
                    <button className="cart-remove-btn" onClick={() => handleRemoveFromCart(item.name)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            className="cart-order-btn"
            disabled={cart.length === 0}
            onClick={handlePlaceOrder}
          >
            Proceed to Order
          </button>
          <Link to="/" className="cart-close-btn">Close</Link>
        </>
      )}
    </div>
  );
};

export default CartPage;