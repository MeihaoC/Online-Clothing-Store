// Importing the Order model
const Order = require("../models/Order");

// Handler to fetch order history of a user
exports.getOrderHistory = async (req, res, next) => {
  try {
    // Find all orders belonging to the authenticated user and populate product details
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name price imageUrl")
      .sort({ orderDate: -1 }); // Sort by most recent first
    
    res.json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};

// Handler to update the status of a specific order
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this order",
      });
    }

    // Prevent updating orders that are already delivered
    if (order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be updated",
      });
    }

    // Prevent updating orders that are already cancelled
    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled orders cannot be updated",
      });
    }

    // Update the order status and save the changes
    order.status = status;
    await order.save();

    // Populate order with product details for response
    const populatedOrder = await Order.findById(order._id).populate("products.product", "name price imageUrl");

    res.json({
      success: true,
      order: populatedOrder,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
