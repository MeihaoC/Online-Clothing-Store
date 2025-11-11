// Importing required modules
const express = require("express");
const {
  getAllProducts,    // Controller to fetch all products with optional filters
  getProductById,    // Controller to fetch a product by its ID
  searchProducts,    // Controller to search for products based on a query
} = require("../controllers/productController");
const { validateProductId } = require("../middleware/validation"); // Validation middleware

// Create a new router instance
const router = express.Router();

// Route to search for products based on a query string
// URL: /products/search?q=<query>
// Controller: searchProducts (handles product search by name)
router.get("/search", searchProducts);

// Route to get a specific product by its ID
// URL: /products/:id
// Middleware: validateProductId (validates product ID format)
// Controller: getProductById (retrieves and sends a single product's details)
router.get("/:id", validateProductId, getProductById);

// Route to fetch all products, optionally filtered by query parameters
// URL: /products/
// Controller: getAllProducts (retrieves and sends all or filtered products)
router.get("/", getAllProducts);

// Export the router for use in other parts of the application
module.exports = router;
