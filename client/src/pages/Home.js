// Import necessary modules and components
import React, { useEffect, useState } from "react";
import axios from "axios"; // For making HTTP requests
import { Link, useSearchParams } from "react-router-dom"; // React Router utilities for navigation and query params
import config from "../config"; // API configuration
import "../css/HomePage.css"; // Import CSS styles for the homepage

// Define the HomePage functional component
const HomePage = () => {
  // State variables
  const [products, setProducts] = useState([]); // Stores all fetched products
  const [selectedCategory, setSelectedCategory] = useState([]); // Tracks selected product categories
  const [selectedSize, setSelectedSize] = useState([]); // Tracks selected product sizes
  const [sortBy, setSortBy] = useState("featured"); // Sort preference (default: featured)
  const [searchParams] = useSearchParams(); // Hook to get query parameters
  const searchQuery = searchParams.get("q") || ""; // Extract search query from URL

  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${config.API_BASE_URL}/products`);
        console.log("API Response:", response.data); // Debug log
        
        // Handle paginated response or direct array
        const productsData = response.data.products || response.data;
        console.log("Products data:", productsData); // Debug log
        
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          console.error("Products data is not an array:", productsData);
          setError("Invalid products data format");
        }
      } catch (err) {
        console.error("Error fetching products:", err); // Log errors
        setError(err.response?.data?.message || err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(); // Invoke the function
  }, []); // Empty dependency array ensures this runs only once on mount

  // Toggle selected categories in the filter
  const toggleCategory = (category) => {
    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category) // Remove category if already selected
        : [...prev, category] // Add category if not selected
    );
  };

  // Toggle selected sizes in the filter
  const toggleSize = (size) => {
    setSelectedSize((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size) // Remove size if already selected
        : [...prev, size] // Add size if not selected
    );
  };

  // Filter and sort products based on user preferences
  const filteredProducts = products
    .filter((product) => {
      // Filter by selected categories
      if (selectedCategory.length > 0 && !selectedCategory.includes(product.category)) {
        return false;
      }
      // Filter by selected sizes
      if (selectedSize.length > 0 && !selectedSize.includes(product.size)) {
        return false;
      }
      // Filter by search query
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true; // Include product if it passes all filters
    })
    .sort((a, b) => {
      // Sort by preference
      if (sortBy === "featured") {
        // Keep original order from API (no sorting) for featured products
        return 0;
      }
      return sortBy === "low-to-high" ? a.price - b.price : b.price - a.price; // Sort by price
    });

  return (
    <div className="homepage">
      <div className="homepage-content">
        {/* Sidebar with filters */}
        <aside className="sidebar">
          <h2 className="sidebar-title">Filters</h2>
          
          {/* Filter by category */}
          <div className="filter-group">
            <h3 className="filter-title">Product Categories</h3>
            <ul className="filter-list">
              {["Top", "Pants", "Dress"].map((category) => (
                <li key={category} className="filter-item">
                  <label className="filter-label">
                    <input
                      type="checkbox"
                      checked={selectedCategory.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="filter-checkbox"
                    />
                    <span className="filter-text">{category}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Filter by size */}
          <div className="filter-group">
            <h3 className="filter-title">Filter by Size</h3>
            <ul className="filter-list">
              {["S", "M", "L", "XL"].map((size) => (
                <li key={size} className="filter-item">
                  <label className="filter-label">
                    <input
                      type="checkbox"
                      checked={selectedSize.includes(size)}
                      onChange={() => toggleSize(size)}
                      className="filter-checkbox"
                    />
                    <span className="filter-text">{size}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main product display */}
        <section className="products">
          <div className="products-header">
            {/* Breadcrumb navigation */}
            <div className="breadcrumb">
              <span>Shop</span>
              <span className="breadcrumb-separator">&gt;</span>
              <span>All Products</span>
              {searchQuery && (
                <>
                  <span className="breadcrumb-separator">&gt;</span>
                  <span className="breadcrumb-search">Search: "{searchQuery}"</span>
                </>
              )}
            </div>
            {/* Sort by dropdown */}
            <div className="sort-by">
              <label className="sort-label">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          {!loading && !error && (
            <div className="results-count">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </div>
          )}

          {/* Grid display of products */}
          <div className="products-grid">
            {loading ? (
              <div className="loading-state">
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>Error: {error}</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  className="product-card"
                  key={product._id}
                >
                  {/* Product image */}
                  <div className="product-image">
                    <img src={product.imageUrl} alt={product.name} />
                  </div>
                  {/* Product name and price */}
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="empty-state">
                <p className="empty-state-title">No products found</p>
                <p className="empty-state-subtitle">
                  {searchQuery 
                    ? `Try adjusting your search or filters to find what you're looking for.`
                    : `Try adjusting your filters to see more products.`
                  }
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
