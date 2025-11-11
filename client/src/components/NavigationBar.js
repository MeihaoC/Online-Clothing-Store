// Importing required modules and components
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Navigation utilities from React Router
import "../css/NavigationBar.css"; // Importing CSS for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Font Awesome icons
import { faSearch } from "@fortawesome/free-solid-svg-icons"; // Specific icon used for search

// NavigationBar functional component
const NavigationBar = ({ loggedInUser, setLoggedInUser }) => {
  // State to handle mobile menu toggle
  const [menuOpen, setMenuOpen] = useState(false);

  // State to handle search query input
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation hook for programmatic navigation
  const navigate = useNavigate();

  // Handle change in search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update the search query state
  };

  // Handle form submission for search
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent default form behavior
    navigate(`/?q=${searchQuery}`); // Navigate to the search results page
  };

  // Handle user logout
  const handleLogout = () => {
    // Remove user credentials from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // Reset the logged-in user state
    setLoggedInUser(null);

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo linking to the homepage */}
      <div className="navbar-logo">
        <Link to="/">Clothing Store</Link>
      </div>

      {/* Mobile menu toggle button */}
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Navigation links */}
      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="navbar-search">
          <input
            type="text"
            placeholder="Search for products"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <FontAwesomeIcon icon={faSearch} /> {/* Search icon */}
          </button>
        </form>

        {/* Navigation links */}
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>

        {/* Conditional rendering based on user's login state */}
        {loggedInUser ? (
          <>
            <Link to="/profile">Profile</Link>
            <span>Welcome, {loggedInUser}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

// Exporting the NavigationBar component for use in other parts of the application
export default NavigationBar;
