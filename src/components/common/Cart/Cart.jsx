import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CartProduct from "./ProductInCart/CartProduct";
import styles from "./Cart.module.css";
import { UserContext } from "../../../context/UserContext";
import PoppingMenu from "../PoppingMenu/PoppingMenu";

const Cart = () => {
	const { cartItems, getTotalPrice, isCartVisible, setCartStatus } =
		useContext(UserContext);
	const navigate = useNavigate();

	const handleCloseCartClick = () => {
		setCartStatus(false);
	};

	const handleCheckoutClick = () => {
		navigate("/checkout"); // redirecting to /checkout
		setCartStatus(false);
	};

	return (
		<PoppingMenu
			title="Basket"
			isVisible={isCartVisible}
			onClose={handleCloseCartClick}
		>
			<div className={styles.mainContent}>
				<div className={styles.buyings}>
					{cartItems.map((product) => (
						<CartProduct key={product.id} product={product} />
					))}
				</div>

				<div className={styles.controlContainer}>
					<button
						onClick={handleCloseCartClick}
						className={styles.continueShoppingButton}
					>
						Continue shopping
					</button>

					<div className={styles.confirmBlock}>
						<div className={styles.totalAmount}>{getTotalPrice()}¥</div>

						<button
							className={styles.checkoutButton}
							onClick={handleCheckoutClick}
						>
							CHECKOUT
						</button>
					</div>
				</div>
			</div>
		</PoppingMenu>
	);
};

export default Cart;
