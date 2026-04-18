import React, { createContext, useState, useEffect, useCallback } from "react";
import {
	login as apiLogin,
	logout as apiLogout,
	register as apiRegister,
	getCurrentUser,
	deleteMyAccount,
} from "../api/authApi";
import {
	getCart,
	addToCart as apiAddToCart,
	updateCartQuantity,
	removeFromCart as apiRemoveFromCart,
	clearCart as apiClearCart,
} from "../api/cartApi";
import { createOrder as apiCreateOrder } from "../api/orderApi";

// Create context to manage purchases
export const UserContext = createContext();

// Provider component for managing the purchase state
export function UserProvider({ children }) {

	const [user, setUser] = useState(() => getCurrentUser());

	const [cartItems, setCartItems] = useState([]);

	// State for tracking the visibility of the cart and auth
	const [isCartVisible, setCartStatus] = useState(false);
	const [isAuthVisible, setAuthStatus] = useState(false);

	// Initialize selected items state, retrieve from localStorage if available
	const [selectedItems, setSelectedItems] = useState(() => {
		const savedSelected = localStorage.getItem("selectedItems");
		return savedSelected ? JSON.parse(savedSelected) : [];
	});

	// Function to save data to localStorage, used with useCallback to optimize performance
	const saveToLocalStorage = useCallback((key, value) => {
		localStorage.setItem(key, JSON.stringify(value));
	}, []);

	// Effect hook to save selected items to localStorage whenever selectedItems state changes
	useEffect(() => {
		saveToLocalStorage("selectedItems", selectedItems);
	}, [selectedItems, saveToLocalStorage]);

	// Effect hook to toggle the "no-scroll" class on the body when the cart is visible
	useEffect(() => {
		document.body.classList.toggle("no-scroll", isCartVisible || isAuthVisible);
		return () => document.body.classList.remove("no-scroll");
	}, [isCartVisible, isAuthVisible]);


	// Function to add/remove a product from the selected items list
	const addToSelected = useCallback((productId) => {
		setSelectedItems((prevSelectedItems) => {
			const exists = prevSelectedItems.some((id) => id === productId);
			return exists
				? prevSelectedItems.filter((id) => id !== productId) // Remove if already selected
				: [...prevSelectedItems, productId]; // Add product if not already selected
		});
	}, []);


	// LogIn function
	const logIn = async (email, password) => {
		const data = await apiLogin(email, password);
		setUser({
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			phone: data.phone,
		});
		return data;
	};

	//logout func
	const logOut = async () => {
		apiLogout();
		setUser(null);
	};

	// SignUp function
	const signUp = async (email, password, firstName, lastName, phone) => {
		await apiRegister(email, password, firstName, lastName, phone);
	};

	// Удаление аккаунта — мягкое удаление на сервере
	const deleteAccount = async () => {
		await deleteMyAccount();
		logOut();
	};

	/// ============ CART ==============

	const loadCart = useCallback(async () => {
		try {
			const data = await getCart();
			setCartItems(data?.items || []);
		} catch (error) {
			console.error("Failed to load cart:", error);
		}
	}, []);

	useEffect(() => {
		if (user) {
			loadCart();
		} else {
			setCartItems([]);
		}
	}, [user, loadCart]);

	const addToCart = useCallback(async (product) => {
		try {
			await apiAddToCart(product.id, 1);
			await loadCart();
		} catch (error) {
			console.error("Failed to add to cart:", error);
			throw error;
		}
	}, [loadCart]);

	// Function for immediate purchase (adds product to cart and shows the cart)
	const buyNow = useCallback(
		async (product) => {
			await addToCart(product); // Add product to the cart
			setCartStatus(true); // Open the cart
		},
		[addToCart]
	);

	const removeFromCart = useCallback(async (product) => {
		await apiRemoveFromCart(product.id);
		await loadCart();
	}, [loadCart]);

	const updateQuantity = useCallback(async (productId, newQuantity) => {
		await updateCartQuantity(productId, newQuantity);
		await loadCart();
	}, [loadCart]);

	const clearCart = useCallback(async () => {
		await apiClearCart();
		await loadCart();
	}, [loadCart]);

	const getTotalPrice = useCallback(() =>
			cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
		[cartItems]);

	const placeOrder = useCallback(async (customerName, customerSurname, customerPhone, customerAddress) => {
		const order = await apiCreateOrder(customerName, customerSurname,  customerPhone, customerAddress);
		setCartItems([]);
		return order;
	}, []);

	// Return the context provider with the values to be shared across components
	return (
		<UserContext.Provider
			value={{
				cartItems,
				buyNow,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				getTotalPrice,
				loadCart,
				placeOrder,
				isCartVisible,
				setCartStatus,
				isAuthVisible,
				setAuthStatus,
				addToSelected,
				selectedItems,
				user,
				setUser,
				logIn,
				signUp,
				logOut,
				deleteAccount
			}}
		>
			{children} {/* Render child components inside the provider */}
		</UserContext.Provider>
	);
}
