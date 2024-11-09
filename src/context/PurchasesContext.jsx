import React, { createContext, useState, useEffect, useCallback } from "react";

// Create context to manage purchases
export const PurchasesContext = createContext();

// Provider component for managing the purchase state
export function PurchasesProvider({ children }) {
  // Initialize cart items state, retrieve from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // State for tracking the visibility of the cart
  const [isCartVisible, setCartStatus] = useState(false);

  // Initialize selected items state, retrieve from localStorage if available
  const [selectedItems, setSelectedItems] = useState(() => {
    const savedSelected = localStorage.getItem("selectedItems");
    return savedSelected ? JSON.parse(savedSelected) : [];
  });

  // Function to save data to localStorage, used with useCallback to optimize performance
  const saveToLocalStorage = useCallback((key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, []);

  // Effect hook to save cart items to localStorage whenever cartItems state changes
  useEffect(() => {
    saveToLocalStorage("cartItems", cartItems);
  }, [cartItems, saveToLocalStorage]);

  // Effect hook to save selected items to localStorage whenever selectedItems state changes
  useEffect(() => {
    saveToLocalStorage("selectedItems", selectedItems);
  }, [selectedItems, saveToLocalStorage]);

  // Effect hook to toggle the "no-scroll" class on the body when the cart is visible
  useEffect(() => {
    document.body.classList.toggle("no-scroll", isCartVisible);
    return () => document.body.classList.remove("no-scroll");
  }, [isCartVisible]);

  // Function to clear all items from the cart
  const clearCart = useCallback(() => setCartItems([]), []);

  // Function to add/remove a product from the selected items list
  const addToSelected = useCallback((product) => {
    setSelectedItems((prevSelectedItems) => {
      const exists = prevSelectedItems.some((item) => item.id === product.id);
      return exists
        ? prevSelectedItems.filter((el) => el.id !== product.id) // Remove if already selected
        : [...prevSelectedItems, { ...product }]; // Add product if not already selected
    });
  }, []);

  // Function to add a product to the cart
  const addToCart = useCallback((product) => {
    setCartItems((prevCartItems) => {
      const existingProduct = prevCartItems.find(
        (item) => item.id === product.id
      );
      return existingProduct
        ? prevCartItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 } // Increase quantity if product exists
              : item
          )
        : [...prevCartItems, { ...product, quantity: 1 }]; // Add new product with quantity 1
    });
  }, []);

  // Function to remove a product from the cart
  const removeFromCart = useCallback((product) => {
    setCartItems(
      (prevCartItems) => prevCartItems.filter((item) => item.id !== product.id) // Filter out the product
    );
  }, []);

  // Function for immediate purchase (adds product to cart and shows the cart)
  const buyNow = useCallback(
    (product) => {
      addToCart(product); // Add product to the cart
      setCartStatus(true); // Open the cart
    },
    [addToCart]
  );

  // Function to update the quantity of a product in the cart
  const updateQuantity = useCallback((productId, delta) => {
    setCartItems(
      (prevCartItems) =>
        prevCartItems
          .map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + delta } // Adjust quantity
              : item
          )
          .filter((item) => item.quantity > 0) // Remove items with zero quantity
    );
  }, []);

  // Function to calculate the total price of all items in the cart
  const getTotalPrice = useCallback(
    () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0), // Sum of item prices * quantity
    [cartItems]
  );

  // Function to send order details to Telegram bot
  const sendMessageToTelegram = useCallback(
    async (customerInfo) => {
      if (cartItems.length > 0) {
        const BOT_TOKEN = process.env.REACT_APP_BOT_TOKEN; // Get bot token from environment variables
        const CHAT_ID = process.env.REACT_APP_CHAT_ID; // Get chat ID from environment variables
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        // Create the order message including cart items and customer info
        const message = `New order:\n\n${cartItems
          .map(
            (item, index) => `${index + 1}. ${item.name} - ${item.quantity} pcs`
          )
          .join("\n")}\n\nTotal: ${getTotalPrice()}¥\n\nCustomer Info:\n${
          customerInfo.name
        }\n${customerInfo.phone}\n${customerInfo.address}`;

        const data = {
          chat_id: CHAT_ID,
          text: message,
        };

        try {
          // Send the POST request to Telegram API
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          if (result.ok) {
            alert("Order has been sent to us!"); // Inform the user if successful
          } else {
            console.error("Error:", result.description); // Log error if something goes wrong
          }
        } catch (error) {
          console.error("Error:", error); // Catch and log any errors during the fetch
        }
      }
    },
    [cartItems, getTotalPrice] // Dependency array, use callback when these values change
  );

  // Return the context provider with the values to be shared across components
  return (
    <PurchasesContext.Provider
      value={{
        cartItems,
        addToCart,
        getTotalPrice,
        updateQuantity,
        clearCart,
        isCartVisible,
        setCartStatus,
        buyNow,
        addToSelected,
        selectedItems,
        removeFromCart,
        sendMessageToTelegram,
      }}
    >
      {children} {/* Render child components inside the provider */}
    </PurchasesContext.Provider>
  );
}
