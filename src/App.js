import "./App.css";
import Footer from "./components/common/Footer/Footer";
import Header from "./components/common/Header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import Home from "./pages/HomePage/HomePage";
import Cart from "./components/common/Cart/Cart";
import { useState, useEffect } from "react";
import { CartProvider } from "./context/CartContext";

function NotFound() {
  return <h2>404 - Not Found</h2>;
}

function App() {
  const [isCartVisible, setCartStatus] = useState(false);

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

  return (
    <BrowserRouter>
      <CartProvider>
        <Header setCartStatus={setCartStatus} />
        <Cart isVisible={isCartVisible} setCartStatus={setCartStatus} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/:products" element={<ProductsPage />} />
          <Route path="/:products/:product" element={<ProductPage />} />
        </Routes>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
