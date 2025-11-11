// Import necessary modules and components
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // React Router hooks for params and navigation
import axios from "axios"; // For making HTTP requests
import config from "../config"; // API configuration
import "../css/ProductDetail.css"; // CSS for styling

// Define the ProductDetail component
const ProductDetail = () => {
  // Extract the product ID from the URL parameters
  const { id } = useParams();

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State to hold product details
  const [product, setProduct] = useState(null);

  // State to manage selected size
  const [selectedSize, setSelectedSize] = useState("S");

  // State to manage selected quantity
  const [quantity, setQuantity] = useState(1);

  // Fetch product details when the component mounts or the ID changes
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Make a GET request to fetch product details
        const response = await axios.get(`${config.API_BASE_URL}/api/products/${id}`);
        // Handle the new response format: { success: true, product: {...} }
        const productData = response.data.product || response.data;
        setProduct(productData); // Set product details in state
      } catch (err) {
        console.error("Error fetching product details:", err); // Log error
      }
    };

    fetchProduct();
  }, [id]); // Dependency array ensures this runs whenever `id` changes

  // Increase quantity by 1
  const increaseQuantity = () => setQuantity(quantity + 1);

  // Decrease quantity by 1 (minimum of 1)
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Handle adding the product to the cart
  const addToCart = async () => {
    const token = localStorage.getItem("token");

    // Redirect to login if the user is not authenticated
    if (!token) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      // Make a POST request to add the product to the user's cart
      const response = await axios.post(
        `${config.API_BASE_URL}/api/users/cart`,
        { productId: id, quantity, size: selectedSize },
        { headers: { Authorization: `Bearer ${token}` } } // Include token in headers
      );

      alert("Product added to cart!");
      console.log("Cart updated:", response.data);
      navigate("/cart"); // Redirect to cart page
    } catch (err) {
      console.error("Error adding to cart:", err); // Log error
      alert("Failed to add product to cart."); // Notify user
    }
  };

  // Show loading message while product data is being fetched
  if (!product) {
    return <p>Loading product details...</p>;
  }

  // Render product details
  return (
    <div className="product-detail">
      {/* Breadcrumb navigation */}
      <nav className="breadcrumb">
        Shop &gt; {product.category} &gt; {product.name}
      </nav>

      <div className="product-container">
        {/* Product image */}
        <div className="product-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        {/* Product information */}
        <div className="product-info">
          <h2>{product.brand || "Brand"}</h2>
          <h1>{product.name}</h1>
          <p className="price">${product.price.toFixed(2)}</p>
          <p className="description">{product.description}</p>

          {/* Size selection */}
          <div className="size-options">
            <p>Size:</p>
            <div className="size-buttons">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className={selectedSize === size ? "selected" : ""} // Highlight selected size
                  onClick={() => setSelectedSize(size)} // Update selected size
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selection */}
          <div className="quantity-selector">
            <p>Quantity:</p>
            <div className="quantity-controls">
              <button onClick={decreaseQuantity}>-</button>
              <span>{quantity}</span>
              <button onClick={increaseQuantity}>+</button>
            </div>
          </div>

          {/* Total price */}
          <p className="total-price">Total: ${(product.price * quantity).toFixed(2)}</p>

          {/* Add to cart button */}
          <button onClick={addToCart} className="add-to-cart">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
