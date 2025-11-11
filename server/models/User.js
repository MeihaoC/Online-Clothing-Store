const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Define the User schema
const userSchema = new mongoose.Schema({
  // Unique username for the user
  username: { 
    type: String, 
    unique: true, // Ensures no duplicate usernames
    required: true 
  },
  // Unique email address for the user
  email: { 
    type: String, 
    unique: true, // Ensures no duplicate emails
    required: true 
  },
  // Hashed password for authentication
  password: { 
    type: String, 
    required: true 
  },
  // Cart containing products and their quantities
  cart: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product" // References the Product model
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1 // Quantity cannot be less than 1
      },
    },
  ],
  // List of completed orders by the user
  orderHistory: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Order" // References the Order model
    }
  ],
});

// Instance method to hash the user's password
userSchema.methods.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10); // Uses bcrypt to hash the password with a salt factor of 10
};

// Instance method to generate a JSON Web Token (JWT) for authentication
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, email: this.email }, // Payload containing the user's ID and email
    process.env.JWT_SECRET, // Secret key from environment variables
    { expiresIn: "1h" } // Token expiry time
  );
};

// Export the User model
module.exports = mongoose.model("User", userSchema);

