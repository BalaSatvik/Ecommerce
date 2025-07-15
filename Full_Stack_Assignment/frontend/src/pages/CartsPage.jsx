import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCartItems,
  removeCartItem,
  clearCart,
  checkoutCart,
} from "../services/CartService";
import { useAuth } from "../context/AuthContext";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const {currentUser} = useAuthAuth();
  const customerId = currentUser.userId;
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
  try {
    setLoading(true);
    const res = await getCartItems(customerId);

    console.log("Cart response:", res.data);

    let items = [];
    if (Array.isArray(res.data)) {
      items = res.data;
    } else if (res.data && Array.isArray(res.data.items)) {
      items = res.data.items;
    }

    setCartItems(items);

  } catch (error) {
    console.error("Failed to load cart", error);
    alert("Failed to load cart.");
  } finally {
    setLoading(false);
  }
};


  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeCartItem(cartItemId);
      loadCart();
    } catch (error) {
      console.error("Failed to remove item", error);
      alert("Failed to remove item.");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart(customerId);
      loadCart();
    } catch (error) {
      console.error("Failed to clear cart", error);
      alert("Failed to clear cart.");
    }
  };

  const handleCheckout = async () => {
    try {
      await checkoutCart(customerId);
      alert("Checkout successful! Redirecting to Orders page.");
      navigate("/orders");
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Checkout failed.");
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">My Cart</h1>

      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.cartItemId}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <p>Product ID: {item.productId}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <button
                className="bg-red-500 px-3 py-1 rounded"
                onClick={() => handleRemoveItem(item.cartItemId)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-4 space-x-4">
            <button
              className="bg-yellow-500 px-4 py-2 rounded"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
            <button
              className="bg-green-500 px-4 py-2 rounded"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
