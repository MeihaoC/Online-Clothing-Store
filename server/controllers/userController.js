// Import necessary modules and models
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");

// Handler to register a new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // Check if a user with the same email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Check if username already exists
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    // Create a new user
    user = new User({ email, username });
    user.password = await user.hashPassword(password); // Hash the password before saving
    await user.save();

    // Generate a token for the newly registered user
    const token = user.generateAuthToken();
    res.status(201).json({
      success: true,
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};

// Handler to log in an existing user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if the provided password matches the stored password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate a token for the authenticated user
    const token = user.generateAuthToken();
    res.json({
      success: true,
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};

// Handler to get the user's cart
exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product", "name price imageUrl");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};

// Handler to add or update items in the user's cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const Product = require("../models/Product");

    // Find the user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify that the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if the product is already in the cart
    const cartItem = user.cart.find((item) => item.product.toString() === productId);
    if (cartItem) {
      cartItem.quantity = quantity; // Update the quantity if the item exists
    } else {
      user.cart.push({ product: productId, quantity }); // Add a new item to the cart
    }

    await user.save();

    // Send the updated cart with product details
    const updatedCart = await User.findById(req.user._id).populate("cart.product", "name price imageUrl");
    res.json({
      success: true,
      cart: updatedCart.cart,
    });
  } catch (err) {
    next(err); // Pass error to error handler middleware
  }
};

// Handler to remove an item from the user's cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove the specified item from the cart
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();

    // Get updated cart with populated product details
    const updatedUser = await User.findById(userId).populate("cart.product", "name price imageUrl");
    res.json({
      success: true,
      cart: updatedUser.cart,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};

// Handler to process a checkout
exports.checkout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, currency, totalAmount } = req.body;

    // Find the user and populate the cart with product details
    const user = await User.findById(userId).populate("cart.product");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Create a new order
    const order = new Order({
      user: userId,
      products: user.cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount,
      currency,
      shippingAddress,
      status: "Ordered",
      orderDate: Date.now(),
    });

    await order.save();

    // Clear the user's cart and update order history
    user.cart = [];
    user.orderHistory.push(order._id);
    await user.save();

    // Populate order with product details for response
    const populatedOrder = await Order.findById(order._id).populate("products.product", "name price imageUrl");
    
    res.status(201).json({
      success: true,
      order: populatedOrder,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};

// Handler to get the user's profile with order history
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "orderHistory",
      populate: {
        path: "products.product",
        select: "name price imageUrl",
      },
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send the user profile and order history as a response
    res.json({
      success: true,
      username: user.username,
      email: user.email,
      orderHistory: user.orderHistory,
    });
  } catch (err) {
    next(err); // Pass error to error handler middleware
  }
};
