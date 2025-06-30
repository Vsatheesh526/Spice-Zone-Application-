import { useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";

import SignupPage from "./pages/SignupPage";
function App() {
  const [cart, setCart] = useState([]);

  // Check login status
const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

// On mount, always check token and update state
useEffect(() => {
  setIsLoggedIn(!!localStorage.getItem("token"));
  const checkLogin = () => setIsLoggedIn(!!localStorage.getItem("token"));
  window.addEventListener("storage", checkLogin);
  return () => window.removeEventListener("storage", checkLogin);
}, []);

  // Add item to cart
  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.name === item.name);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, qty: 1 }];
    });
  };

  // Update item quantity
  const handleUpdateQty = (itemName, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.name === itemName
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  // Remove item from cart
  const handleRemoveFromCart = (itemName) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== itemName));
  };

  return (
    <Router>
      <Routes>
        {/* Login route */}

       <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />

        {/* Home route (default) */}
        
        <Route path="/" element={<Navigate to="/home" replace />} />
        {/* Cart route */}
        <Route
          path="/cart"
          element={
            isLoggedIn ? (
              <CartPage
                cart={cart}
                handleRemoveFromCart={handleRemoveFromCart}
                handleUpdateQty={handleUpdateQty}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Optional: /home redirects to home if logged in */}
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <HomePage cart={cart} handleAddToCart={handleAddToCart} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Signup route */}
        <Route path="/signup" element={<SignupPage />} />

        {/* Redirect any other route to home */}
      </Routes>
    </Router>
  );
}

export default App;
