const mongoose = require("mongoose");

// Define the Product schema
const productSchema = new mongoose.Schema({
  // Name of the product
  name: { 
    type: String, 
    required: true // Ensure every product has a name
  },
  // Category of the product (e.g., "Top", "Pants", "Dress")
  category: { 
    type: String, 
    required: true // Ensure every product is assigned a category
  },
  // Price of the product
  price: { 
    type: Number, 
    required: true, // Ensure every product has a price
    min: 0 // Price cannot be negative
  },
  // Size of the product (e.g., "S", "M", "L", "XL")
  size: { 
    type: String, 
    required: true // Ensure every product has a size
  },
  // Brief description of the product
  description: { 
    type: String, 
    required: true // Ensure every product has a description
  },
  // URL for the product image
  imageUrl: { 
    type: String, 
    required: true // Ensure every product has an image
  },
});

// Export the Product model
module.exports = mongoose.model("Product", productSchema);

  
