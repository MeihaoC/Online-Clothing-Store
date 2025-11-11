// Import necessary modules
const express = require("express"); // Framework for building the server
const mongoose = require("mongoose"); // MongoDB object modeling tool
const cors = require("cors"); // Middleware for enabling Cross-Origin Resource Sharing
const dotenv = require("dotenv"); // Module to load environment variables
const helmet = require("helmet"); // Security middleware
const rateLimit = require("express-rate-limit"); // Rate limiting middleware
const errorHandler = require("./middleware/errorHandler"); // Error handling middleware

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

// Create an instance of the Express application
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
});
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

// Middleware to enable CORS (allows cross-origin requests)
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',           // React dev server
      'http://localhost:3001',           // Alternative dev port
      process.env.FRONTEND_URL,          // Production frontend URL from env
    ].filter(Boolean); // Remove undefined values
    
    // Allow if origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In development, allow all origins for easier testing
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true, // Allow cookies/credentials to be sent
  optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
};

app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json({ limit: "10mb" })); // Limit request body size

// Import route handlers
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Define API routes
app.use("/api/users", userRoutes); // Routes for user-related endpoints
app.use("/api/products", productRoutes); // Routes for product-related endpoints
app.use("/api/orders", orderRoutes); // Routes for order-related endpoints

// Define the port for the server
const PORT = process.env.PORT || 5002; // Default to 5002 if PORT is not defined in .env

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGODB_URI, {
    // MongoDB connection options
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB"); // Log successful connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    }); // Start server
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err); // Log connection errors
    process.exit(1); // Exit process on connection failure
  });
