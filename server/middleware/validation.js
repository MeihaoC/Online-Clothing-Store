// Input validation middleware using express-validator
const { body, param, query, validationResult } = require("express-validator");

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Validation rules for user registration
const validateRegister = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  validate,
];

// Validation rules for user login
const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

// Validation rules for adding to cart
const validateAddToCart = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID format"),
  body("quantity")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be between 1 and 100"),
  validate,
];

// Validation rules for checkout
const validateCheckout = [
  body("shippingAddress.userName")
    .trim()
    .notEmpty()
    .withMessage("User name is required"),
  body("shippingAddress.streetAddress")
    .trim()
    .notEmpty()
    .withMessage("Street address is required"),
  body("shippingAddress.city").trim().notEmpty().withMessage("City is required"),
  body("shippingAddress.province")
    .trim()
    .notEmpty()
    .withMessage("Province is required"),
  body("shippingAddress.zipCode")
    .trim()
    .notEmpty()
    .withMessage("Zip code is required"),
  body("currency")
    .isIn(["USD", "EUR", "GBP", "CAD"])
    .withMessage("Invalid currency"),
  body("totalAmount")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a positive number"),
  validate,
];

// Validation rules for product ID parameter
const validateProductId = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
  validate,
];

// Validation rules for order status update
const validateOrderStatus = [
  body("status")
    .isIn(["Ordered", "Delivered", "Cancelled"])
    .withMessage("Invalid order status"),
  validate,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateAddToCart,
  validateCheckout,
  validateProductId,
  validateOrderStatus,
};

