import React, { createContext, useState, useEffect } from "react";

export const PurchasesContext = createContext();

export function PurchasesProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartVisible, setCartStatus] = useState(false);
  const [selectedItems, setSelectedItems] = useState(() => {
    const savedSelected = localStorage.getItem("selectedItems");
    return savedSelected ? JSON.parse(savedSelected) : [];
  });

  //  Updating localstorage when we are adding cartItem
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  }, [selectedItems]);

  useEffect(() => {
    // when cart is visible we cant scroll
    if (isCartVisible) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isCartVisible]);
  const clearCart = () => {
    setCartItems([]);
  };

  const addToSelected = (product) => {
    setSelectedItems((prevSelectedItems) => {
      const existingProduct = prevSelectedItems.find(
        (item) => item.id === product.id
      );
      if (existingProduct) {
        return prevSelectedItems.filter((el) => el.id !== product.id);
      } else {
        return [...prevSelectedItems, { ...product }];
      }
    });
  };

  const addToCart = (product) => {
    setCartItems((prevCartItems) => {
      const existingProduct = prevCartItems.find(
        (item) => item.id === product.id
      );
      if (existingProduct) {
        return prevCartItems.filter((el) => el.id !== product.id);
      } else {
        return [...prevCartItems, { ...product, quantity: 1 }];
      }
    });
  };

  const buyNow = (product) => {
    addToCart(product);
    setCartStatus(true);
  };

  const updateQuantity = (productId, delta) => {
    setCartItems((prevCartItems) =>
      prevCartItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

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
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
}
