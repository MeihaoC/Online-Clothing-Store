// Import necessary modules and components
import React, { useEffect, useState } from "react";
import axios from "axios"; // For making HTTP requests
import config from "../config"; // API configuration
import "../css/UserProfile.css"; // CSS for styling

// UserProfile component, displays user profile and order details
const UserProfile = ({ loggedInUser }) => {
  // State to hold profile data
  const [profileData, setProfileData] = useState(null);
  
  // State to hold order details
  const [orderDetails, setOrderDetails] = useState([]);
  
  // State to manage error messages
  const [error, setError] = useState(null);

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      // Handle case where user is not logged in
      if (!token) {
        setError("User is not logged in");
        return;
      }

      try {
        // Make a GET request to fetch profile data
        const response = await axios.get(`${config.API_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }, // Pass token in headers for authentication
        });

        // Set profile and order details in state
        setProfileData(response.data);
        setOrderDetails(response.data.orderHistory);
      } catch (err) {
        console.error("Error loading profile:", err); // Log error
        setError("Failed to load user profile."); // Display error message
      }
    };

    fetchUserProfile(); // Invoke the function
  }, []); // Empty dependency array ensures this runs only once on mount

  // Render error message if there is an error
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Render loading message while profile data is being fetched
  if (!profileData) {
    return (
      <div className="user-profile">
        <div className="loading-message">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      {/* Sidebar with personal information */}
      <div className="profile-sidebar">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {profileData.username.charAt(0).toUpperCase()}
            </div>
          </div>
          <h3>{profileData.username}</h3> {/* Display username */}
        </div>
        <div className="personal-info">
          <h4>Personal Information</h4>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{profileData.email}</span>
          </div>
        </div>
      </div>

      {/* Main content with order details */}
      <div className="profile-content">
        <h2>Order History</h2>
        {orderDetails.length > 0 ? (
          // Map through order details and render each order
          orderDetails.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-header-left">
                  <h3 className="order-title">Order #{order._id.slice(-8).toUpperCase()}</h3>
                  <p className="order-date">
                    {new Date(order.orderDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="order-header-right">
                  <span className={`order-status order-status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <p className="order-total">
                    {order.currency} {order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
              
              {order.products && order.products.length > 0 && (
                <div className="order-products">
                  {order.products.map((item, index) => (
                    <div key={index} className="order-product-item">
                      {item.product?.imageUrl && (
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name || 'Product'} 
                          className="order-product-image"
                        />
                      )}
                      <div className="order-product-details">
                        <p className="order-product-name">
                          {item.product?.name || 'Product'}
                        </p>
                        <p className="order-product-quantity">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="order-product-price">
                        ${item.product?.price ? (item.product.price * item.quantity).toFixed(2) : '0.00'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              {order.shippingAddress && (
                <div className="order-shipping">
                  <h4>Shipping Address</h4>
                  <p className="shipping-address">
                    {order.shippingAddress.userName}<br />
                    {order.shippingAddress.streetAddress}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zipCode}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          // Display message if no order details are available
          <div className="no-orders">
            <p>No orders yet.</p>
            <p className="no-orders-subtitle">Start shopping to see your order history here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
