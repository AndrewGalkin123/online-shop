import "./App.css";
import Footer from "./components/common/Footer/Footer";
import Header from "./components/common/Header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import Home from "./pages/HomePage/HomePage";

function NotFound() {
  return <h2>404 - Not Found</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/:products" element={<ProductsPage />} />
        <Route path="/:products/:product" element={<ProductPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
