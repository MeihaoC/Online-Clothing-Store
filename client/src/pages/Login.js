// Import necessary modules and components
import React, { useState } from "react";
import axios from "axios"; // For making HTTP requests
import { useNavigate } from "react-router-dom"; // For navigation
import config from "../config"; // API configuration
import "../css/Login.css"; // Importing CSS for styling

// Login component with `setLoggedInUser` prop to update user state
const Login = ({ setLoggedInUser }) => {
  // State for registration form data
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });
  
  // State for login form data
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // State for loading and errors
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Hook for navigation
  const navigate = useNavigate();

  // Handle input changes in the registration form
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value }); // Update the respective field in `registerData`
  };

  // Handle input changes in the login form
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value }); // Update the respective field in `loginData`
  };

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setRegisterLoading(true);
    setRegisterError("");
    setRegisterSuccess(false);
    
    try {
      // Send registration data to the server
      const response = await axios.post(`${config.API_BASE_URL}/api/users/register`, registerData);
      
      // Check if registration was successful
      if (response.data.success) {
        setRegisterSuccess(true);
        // Clear the registration form
        setRegisterData({ username: "", email: "", password: "" });
        // Clear success message after 5 seconds
        setTimeout(() => setRegisterSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Error creating account:", err);
      console.error("Error response:", err.response?.data);
      
      // Handle validation errors from express-validator
      let errorMessage = "Error creating account.";
      
      if (err.response?.data) {
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          // Multiple validation errors
          errorMessage = err.response.data.errors.map(e => e.msg || e.message || e).join(", ");
        } else if (err.response.data.message) {
          // Single error message
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          // Alternative error format
          errorMessage = err.response.data.error;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setRegisterError(errorMessage);
    } finally {
      setRegisterLoading(false);
    }
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoginLoading(true);
    setLoginError("");
    
    try {
      // Send login data to the server and receive a response
      const response = await axios.post(`${config.API_BASE_URL}/api/users/login`, loginData);
      console.log("Login response:", response.data); // Log server response for debugging

      // Verify response format
      if (!response.data.success || !response.data.token || !response.data.user) {
        throw new Error("Invalid response from server");
      }

      // Update logged-in user state and store token in localStorage
      setLoggedInUser(response.data.user.username);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.user.username); // Store username for App.js

      // Redirect to the home page after successful login
      navigate("/");
    } catch (err) {
      console.error("Error logging in:", err.response?.data?.message || err.message);
      setLoginError(err.response?.data?.message || "Error logging in.");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Container for both forms */}
      <div className="forms-container">
        
        {/* Login form */}
        <div className="form-box">
          <h2>Sign In</h2>
          <p className="form-subtitle">Sign in to your account to continue shopping</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-email">Email address *</label>
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                disabled={loginLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password *</label>
              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                disabled={loginLoading}
              />
            </div>

            {loginError && (
              <div className="error-message">
                {loginError}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loginLoading}>
              {loginLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Registration form */}
        <div className="form-box">
          <h2>Create Account</h2>
          <p className="form-subtitle">Create a new account to start shopping</p>
          
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="register-username">Username *</label>
              <input
                id="register-username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={registerData.username}
                onChange={handleRegisterChange}
                required
                disabled={registerLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email *</label>
              <input
                id="register-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
                disabled={registerLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Password *</label>
              <input
                id="register-password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
                disabled={registerLoading}
              />
            </div>

            {registerSuccess && (
              <div className="success-message">
                Account created successfully! Please sign in with your credentials.
              </div>
            )}

            {registerError && (
              <div className="error-message">
                {registerError}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={registerLoading}>
              {registerLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
