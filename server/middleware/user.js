// Importing the JSON Web Token (JWT) library
const jwt = require("jsonwebtoken");

// Middleware to authenticate requests using JWT
module.exports = (req, res, next) => {
  // Retrieve the Authorization header from the request
  const authHeader = req.header("Authorization"); 
  if (!authHeader) {
    // If no Authorization header is provided, deny access
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  // Extract the token by removing the "Bearer " prefix
  const token = authHeader.replace("Bearer ", ""); 
  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    
    // Attach the decoded user information to the request object
    req.user = decoded; 

    // Proceed to the next middleware or route handler
    next(); 
  } catch (err) {
    // If the token is invalid, return an error response
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
