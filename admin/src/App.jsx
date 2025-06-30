import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminSignup from "./pages/AdminSignup";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import ViewProducts from "./pages/ViewProducts";
import AddOffer from "./pages/AddOffer";
import ViewOffers from "./pages/ViewOffers";
import ViewUsers from "./pages/ViewUsers";
import ViewOrders from "./pages/ViewOrders";
import AddCity from "./pages/AddCity";
import ViewCities from "./pages/ViewCities";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("adminToken"));
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<AdminSignup onSignup={() => window.location = "/login"} />} />
        <Route path="/login" element={<AdminLogin onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/add-product" element={isLoggedIn ? <AddProduct /> : <Navigate to="/login" />} />
        <Route path="/view-products" element={isLoggedIn ? <ViewProducts /> : <Navigate to="/login" />} />
        <Route path="/add-offer" element={isLoggedIn ? <AddOffer /> : <Navigate to="/login" />} />
        <Route path="/view-offers" element={isLoggedIn ? <ViewOffers /> : <Navigate to="/login" />} />
        <Route path="/view-users" element={isLoggedIn ? <ViewUsers /> : <Navigate to="/login" />} />
        <Route path="/view-orders" element={isLoggedIn ? <ViewOrders /> : <Navigate to="/login" />} />
        <Route path="/add-city" element={isLoggedIn ? <AddCity /> : <Navigate to="/login" />} />
        <Route path="/view-cities" element={isLoggedIn ? <ViewCities /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;