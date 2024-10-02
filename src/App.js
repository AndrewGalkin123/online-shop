import "./App.css";
import Footer from "./components/common/Footer/Footer";
import Header from "./components/common/Header/Header";
import Introduction from "./components/Introduction/Introduction";
import Offer from "./components/Offer/Offer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sale from "./pages/Sale/Sale";

function NotFound() {
  return <h2>404 - Not Found</h2>;
}

function Home() {
  return (
    <div>
      <Introduction />
      <Offer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/sale" element={<Sale />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
