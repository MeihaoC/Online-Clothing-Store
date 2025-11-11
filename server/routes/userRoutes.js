// Importing required modules
const express = require("express");
const {
  register,        // Controller for user registration
  login,           // Controller for user login
  getCart,         // Controller to retrieve the user's cart
  addToCart,       // Controller to add/update items in the cart
  removeFromCart,  // Controller to remove items from the cart
  checkout,        // Controller for handling checkout process
  getProfile,      // Controller to retrieve the user's profile
} = require("../controllers/userController");
const auth = require("../middleware/user"); // Middleware for authentication
const {
  validateRegister,
  validateLogin,
  validateAddToCart,
  validateCheckout,
} = require("../middleware/validation"); // Validation middleware

// Create a new router instance
const router = express.Router();

// Route to register a new user
// URL: /users/register
// Middleware: validateRegister (validates input)
// Controller: register (handles user registration)
router.post("/register", validateRegister, register);

// Route to log in an existing user
// URL: /users/login
// Middleware: validateLogin (validates input)
// Controller: login (handles user authentication and token generation)
router.post("/login", validateLogin, login);

// Route to get the authenticated user's cart
// URL: /users/cart
// Middleware: auth (ensures the user is authenticated)
// Controller: getCart (retrieves the user's cart)
router.get("/cart", auth, getCart);

// Route to add or update items in the authenticated user's cart
// URL: /users/cart
// Middleware: auth (ensures the user is authenticated), validateAddToCart (validates input)
// Controller: addToCart (handles adding/updating cart items)
router.post("/cart", auth, validateAddToCart, addToCart);

// Route to remove an item from the authenticated user's cart
// URL: /users/cart/item/:productId
// Middleware: auth (ensures the user is authenticated)
// Controller: removeFromCart (handles item removal from the cart)
router.delete("/cart/item/:productId", auth, removeFromCart);

// Route to handle the checkout process for the authenticated user's cart
// URL: /users/cart/checkout
// Middleware: auth (ensures the user is authenticated), validateCheckout (validates input)
// Controller: checkout (processes the checkout)
router.post("/cart/checkout", auth, validateCheckout, checkout);

// Route to get the authenticated user's profile
// URL: /users/profile
// Middleware: auth (ensures the user is authenticated)
// Controller: getProfile (retrieves the user's profile and order history)
router.get("/profile", auth, getProfile);

// Export the router for use in other parts of the application
module.exports = router;

