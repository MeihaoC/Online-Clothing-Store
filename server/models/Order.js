const mongoose = require("mongoose");

// Define the Order schema
const orderSchema = new mongoose.Schema({
  // Reference to the user who placed the order
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  // Array of products in the order, each with product reference and quantity
  products: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1 // Ensure quantity is at least 1
      },
    },
  ],
  // Total price of the order in the specified currency
  totalAmount: { 
    type: Number, 
    required: true 
  },
  // Currency used for the order (e.g., "USD", "CAD")
  currency: { 
    type: String, 
    required: true 
  },
  // Shipping address for the order
  shippingAddress: {
    userName: { 
      type: String, 
      required: true // Name of the recipient
    },
    streetAddress: { 
      type: String, 
      required: true 
    },
    city: { 
      type: String, 
      required: true 
    },
    province: { 
      type: String, 
      required: true 
    },
    zipCode: { 
      type: String, 
      required: true 
    },
  },
  // Status of the order with predefined options
  status: { 
    type: String, 
    enum: ["Ordered", "Delivered", "Cancelled"], 
    default: "Ordered" // Default status when an order is created
  },
  // Date when the order was placed, defaults to the current date/time
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
});

// Export the Order model
module.exports = mongoose.model("Order", orderSchema);

