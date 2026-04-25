import "./App.css";
import Footer from "./components/common/Footer/Footer";
import Header from "./components/common/Header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import Home from "./pages/HomePage/HomePage";
import Cart from "./components/common/Cart/Cart";
import { useState } from "react";
import { UserProvider } from "./context/UserContext";
import AboutUs from "./pages/AboutUs/AboutUsPage";
import Modal from "./components/Modal/Modal";
import CheckoutOrderPage from "./pages/CheckoutOrder/CheckoutOrderPage";
import Auth from "./components/common/Authorization/Auth";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import ToastProvider from "./components/common/ToastProvider/ToastProvider";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";
import NotFound from "./pages/NotFound/NotFound";

function App() {
	const [isCatalogOpen, setCatalogStatus] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(true); // Modal state to control visibility

	// Function to handle closing the modal
	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	return (
		<BrowserRouter>
			<UserProvider>
				{/* Modal component to show/hide based on the state */}
				<Modal isOpen={isModalOpen} onClose={handleCloseModal} />

				{/* Header with catalog status prop */}
				<Header
					isCatalogOpen={isCatalogOpen}
					setCatalogStatus={setCatalogStatus}
				/>

				<ToastProvider />
				<Cart />
				<Auth />
				<Routes>
					{/* Home route */}
					<Route
						path="/"
						element={<Home setCatalogStatus={setCatalogStatus} />}
					/>
					{/* About Us page */}
					<Route path="/aboutUs" element={<AboutUs />} />
					{/* 404 - Not Found route */}
					<Route path="*" element={<NotFound />} />
					{/* Products page route */}
					<Route path="/:products" element={<ProductsPage />} />
					{/* Single product page route */}
					<Route path="/:products/:product" element={<ProductPage />} />
					{/* Checkout page route */}
					<Route path="/checkout" element={<CheckoutOrderPage />} />

					<Route path="/orders" element={<OrdersPage />} />

					<Route
						path="/adminPanel"
						element={
							<ProtectedRoute roles={["ROLE_ADMIN", "ROLE_MANAGER"]}>
								<AdminPanel />
							</ProtectedRoute>
						}
					/>
				</Routes>

				{/* Footer component */}
				<Footer />
			</UserProvider>
		</BrowserRouter>
	);
}

export default App;
