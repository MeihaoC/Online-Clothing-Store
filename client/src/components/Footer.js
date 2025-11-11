// Importing the React library for creating the component
import React from 'react';
import { Link } from 'react-router-dom';

// Importing the CSS file for styling the Footer component
import '../css/Footer.css';

// Defining the Footer functional component
const Footer = () => {
  return (
    // Footer element with a class for styling
    <footer className="footer">
      <div className="footer-content">
        {/* Company/Store Info */}
        <div className="footer-section">
          <h3>Clothing Store</h3>
          <p>Your one-stop shop for the latest fashion trends and styles.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/cart">Shopping Cart</Link>
            <Link to="/profile">My Account</Link>
          </div>
        </div>

        {/* Customer Service */}
        <div className="footer-section">
          <h4>Customer Service</h4>
          <div className="footer-links">
            <a href="#contact">Contact Us</a>
            <a href="#shipping">Shipping Info</a>
            <a href="#returns">Returns</a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@clothingstore.com</p>
          <p>Phone: 1-800-CLOTHING</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2024 Clothing Store. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

// Exporting the Footer component to be used in other parts of the application
export default Footer;


