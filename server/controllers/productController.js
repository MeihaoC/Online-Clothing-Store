// Importing the Product model
const Product = require("../models/Product");

// Handler to fetch all products based on optional filters
exports.getAllProducts = async (req, res, next) => {
  try {
    // Extracting query parameters from the request
    const { category, minPrice, maxPrice, size, page = 1, limit = 20 } = req.query;
    const filter = {}; // Initializing an empty filter object

    // Adding category filter if specified
    if (category) {
      filter.category = category;
    }

    // Adding price range filters if specified
    if (minPrice || maxPrice) {
      filter.price = {}; // Create a price object in the filter
      if (minPrice) filter.price.$gte = Number(minPrice); // Minimum price filter
      if (maxPrice) filter.price.$lte = Number(maxPrice); // Maximum price filter
    }

    // Adding size filter if specified
    if (size) {
      filter.size = size;
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Limit max to 100
    const skip = (pageNum - 1) * limitNum;
    
    // Fetching products from the database based on the filter with pagination
    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limitNum),
      Product.countDocuments(filter)
    ]);
    
    // Sending the filtered products with pagination info as the response
    res.json({
      success: true,
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};

// Handler to fetch a specific product by its ID
exports.getProductById = async (req, res, next) => {
  try {
    // Fetching the product by its ID from the database
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};

// Handler to search for products based on a query
exports.searchProducts = async (req, res, next) => {
  try {
    const query = req.query.q; // Extracting the search query from the request
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    // Performing a case-insensitive search for products by name
    const products = await Product.find({
      name: { $regex: query.trim(), $options: "i" }, // Regex for partial matching, case-insensitive
    });

    res.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
