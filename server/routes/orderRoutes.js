// Importing required modules
const express = require("express");
const { getOrderHistory, updateOrderStatus } = require("../controllers/orderController");
const auth = require("../middleware/user"); // Middleware for authentication
const { validateOrderStatus } = require("../middleware/validation"); // Validation middleware

// Create a new router instance
const router = express.Router();

// Route to get the order history of an authenticated user
// URL: /orders/history
// Middleware: auth (ensures the user is authenticated)
// Controller: getOrderHistory (retrieves and sends the order history)
router.get("/history", auth, getOrderHistory);

// Route to update the status of a specific order
// URL: /orders/:id/status
// Middleware: auth (ensures the user is authenticated), validateOrderStatus (validates input)
// Controller: updateOrderStatus (handles order status update)
router.patch("/:id/status", auth, validateOrderStatus, updateOrderStatus);

// Export the router for use in other parts of the application
module.exports = router;


