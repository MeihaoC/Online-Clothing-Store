// Import necessary modules and components
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar"; // Navigation bar component
import Footer from "./components/Footer"; // Footer component
import HomePage from "./pages/Home"; // Home page component
import ProductDetail from "./pages/ProductDetail"; // Product detail page
import Login from "./pages/Login"; // Login page
import Checkout from "./pages/CheckoutPage"; // Checkout page
import ShoppingCart from "./pages/ShoppingCart"; // Shopping cart page
import UserProfile from "./pages/UserProfile"; // User profile page

function App() {
  // State to track the logged-in user
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Check local storage for user login data on component mount
  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve JWT token
    const username = localStorage.getItem("username"); // Retrieve username
    if (token && username) {
      setLoggedInUser(username); // Set logged-in user if data is found
    }
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* Main application container */}
      <div className="app">
        {/* Navigation bar with props for user state */}
        <NavigationBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
        
        {/* Main content area */}
        <main className="main-content">
          <Routes>
            {/* Route for the homepage */}
            <Route path="/" element={<HomePage />} />

            {/* Route for product detail page */}
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Route for user profile page, requires logged-in user */}
            <Route
              path="/profile"
              element={<UserProfile loggedInUser={loggedInUser} />}
            />

            {/* Route for login page */}
            <Route
              path="/login"
              element={<Login setLoggedInUser={setLoggedInUser} />}
            />

            {/* Route for shopping cart page */}
            <Route
              path="/cart"
              element={<ShoppingCart loggedInUser={loggedInUser} />}
            />

            {/* Route for checkout page */}
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>

        {/* Footer at the bottom of the application */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
