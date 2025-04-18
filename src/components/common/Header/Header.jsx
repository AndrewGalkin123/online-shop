import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import Catalog from "./Catalog/Catalog";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";

const Header = ({ isCatalogOpen, setCatalogStatus }) => {
	const [isMenuOpen, setMenuOpen] = useState(false);
	const [hoveredImage, setHoveredImage] = useState(null); // State to track hovered element
	const { setCartStatus, setAuthStatus } = useContext(UserContext);

	const handleCartClick = () => {
		setCartStatus(true);
	};

	const handleAuthClick = () => {
		setAuthStatus(true);
	};

	const toggleCatalog = () => {
		setCatalogStatus(!isCatalogOpen);
		setMenuOpen(false);
	};

	const toggleMenu = () => {
		setMenuOpen(!isMenuOpen);
		setCatalogStatus(false);
	};

	const handleMouseEnter = (image) => {
		setHoveredImage(image);
	};

	const handleMouseLeave = () => {
		setHoveredImage(null); // Reset on mouse leave
	};

	// Define image paths based on hover state
	const getImageSrc = (image) => {
		switch (image) {
			case "cart":
				return hoveredImage === "cart"
					? "/images/bag-cross-hover-gradient.png"
					: "/images/bag-cross.png";
			case "user":
				return hoveredImage === "user"
					? "/images/user-hover.png"
					: "/images/user.png";
			case "heart":
				return hoveredImage === "heart"
					? "/images/heart-gradient-hover.png"
					: "/images/heart.png";
			default:
				return "";
		}
	};

	return (
		<header className={styles.header}>
			<Link to="/">
				<img className={styles.icon} src="/images/mainIcon.png" alt="Icon" />
			</Link>
			<nav className={`${styles.navigation} ${isMenuOpen ? styles.open : ""}`}>
				<ul>
					<li className="gradientHover">
						<Link onClick={toggleCatalog}>Catalog</Link>
					</li>
					<li>
						<Link to="/newCollection">New collection</Link>
					</li>
					<li>
						<Link to="/bestSellings">Best Sellings</Link>
					</li>
					<li>
						<Link to="/sale">Sale</Link>
					</li>
					{/* Showing cart and favourites only on mobiles */}
					{isMenuOpen && (
						<>
							<li>
								<Link onClick={handleCartClick}>Cart</Link>
							</li>
							<li>
								<Link to="/favourites">Favourites</Link>
							</li>
						</>
					)}
				</ul>
			</nav>
			<div className={styles.purchases}>
				<img
					onClick={handleCartClick}
					src={getImageSrc("cart")} // Get image based on hover state
					alt="cart"
					onMouseEnter={() => handleMouseEnter("cart")} // Set hover state for cart
					onMouseLeave={handleMouseLeave} // Reset on mouse leave
				/>
				<Link to="/favourites">
					<img
						src={getImageSrc("heart")} // Get image based on hover state
						alt="selected"
						onMouseEnter={() => handleMouseEnter("heart")} // Set hover state for heart
						onMouseLeave={handleMouseLeave} // Reset on mouse leave
					/>
				</Link>
				<img
					onClick={handleAuthClick}
					src={getImageSrc("user")} // Get image based on hover state
					alt="user"
					onMouseEnter={() => handleMouseEnter("user")} // Set hover state for cart
					onMouseLeave={handleMouseLeave} // Reset on mouse leave
				/>
			</div>
			<button className={styles.burger} onClick={toggleMenu}>
				<img src="/images/burgerMenu.png" alt="menu" />
			</button>
			{/* darkens the background */}
			{isMenuOpen && (
				<div className={styles.overlay} onClick={toggleMenu}></div>
			)}
			<Catalog isOpen={isCatalogOpen} toggleCatalog={toggleCatalog} />
		</header>
	);
};

export default Header;
