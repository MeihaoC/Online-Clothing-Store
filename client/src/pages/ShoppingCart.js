// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For programmatic navigation
import axios from "axios"; // For making HTTP requests
import config from "../config"; // API configuration
import "../css/ShoppingCart.css"; // Import CSS for styling

// Define the ShoppingCart component
const ShoppingCart = () => {
  // State to manage cart items
  const [cart, setCart] = useState([]);
  
  // State to manage the total cost
  const [total, setTotal] = useState(0);

  // State to track whether the cart is being updated
  const [isUpdating, setIsUpdating] = useState(false);

  // State to track if redirect has been initiated (prevents duplicate alerts in StrictMode)
  const [hasRedirected, setHasRedirected] = useState(false);

  // Hook for navigation
  const navigate = useNavigate();

  // Function to fetch cart items from the server
  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    // Redirect to login if the user is not authenticated
    if (!token) {
      if (!hasRedirected) {
        setHasRedirected(true);
        navigate("/login");
      }
      return;
    }

    try {
      // Make a GET request to fetch the cart items
      const response = await axios.get(`${config.API_BASE_URL}/users/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Handle new response format: { success: true, cart: [...] }
      const cartData = response.data.cart || response.data;
      setCart(cartData); // Set the cart items
      calculateTotal(cartData); // Calculate the total cost
    } catch (err) {
      console.error("Error fetching cart:", err); // Log errors
      // If it's an authentication error, redirect to login
      if (err.response?.status === 401 && !hasRedirected) {
        setHasRedirected(true);
        navigate("/login");
      }
    }
  };

  // Fetch the cart when the component mounts
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to calculate the total cost of the cart
  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setTotal(total); // Update the total state
  };

  // Function to update the quantity of a cart item
  const updateCartQuantity = async (productId, change) => {
    const token = localStorage.getItem("token");
    const currentItem = cart.find((item) => item.product._id === productId);

    if (!currentItem) return; // Return if the item is not found

    const newQuantity = currentItem.quantity + change;
    if (newQuantity < 1) return; // Prevent quantities less than 1

    try {
      setIsUpdating(true);
      // Make a POST request to update the cart item quantity
      await axios.post(
        `${config.API_BASE_URL}/users/cart`,
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCart(); // Refresh the cart after updating
    } catch (err) {
      console.error("Error updating quantity:", err); // Log errors
      alert("Failed to update quantity.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to remove an item from the cart
  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");

    try {
      setIsUpdating(true);
      // Make a DELETE request to remove the item from the cart
      await axios.delete(`${config.API_BASE_URL}/users/cart/item/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart(); // Refresh the cart after removing the item
    } catch (err) {
      console.error("Error removing item:", err); // Log errors
      alert("Failed to remove item from cart.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Navigate to the checkout page
  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.length > 0 ? (
        <>
          {/* Table displaying cart items */}
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.product._id}>
                  <td>
                    <div className="item-info">
                      {item.product.imageUrl && (
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="cart-image"
                        />
                      )}
                      <span className="item-name">{item.product.name}</span>
                    </div>
                  </td>
                  <td className="item-price">${item.product.price.toFixed(2)}</td>
                  <td>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => updateCartQuantity(item.product._id, -1)} // Decrease quantity
                        disabled={item.quantity <= 1 || isUpdating} // Disable if quantity is 1
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateCartQuantity(item.product._id, 1)} // Increase quantity
                        disabled={isUpdating} // Disable if updating
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="item-subtotal">${(item.product.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="remove-button"
                      onClick={() => removeItem(item.product._id)} // Remove item
                      disabled={isUpdating} // Disable if updating
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Total cost and checkout button */}
          <div className="cart-total">
            <h3>Total: ${total.toFixed(2)}</h3>
            <button
              className="checkout-button"
              onClick={handleCheckout} // Navigate to checkout
              disabled={isUpdating} // Disable if updating
            >
              Check Out
            </button>
          </div>
        </>
      ) : (
        // Message when the cart is empty
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button 
            className="shop-now-button"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
