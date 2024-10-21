import styles from "./Header.module.css";
import icon from "./icon.png";
import cart from "./bag-cross.png";
import { Link } from "react-router-dom";
import Catalog from "../Catalog/Catalog";
import { useContext, useState } from "react";
import { CartContext } from "../../../context/CartContext";

const Header = () => {
  const [isCatalogOpen, setCatalogOpen] = useState(false);
  const { setCartStatus } = useContext(CartContext);
  const handleCartClick = () => {
    setCartStatus(true);
  };
  const toggleCatalog = () => {
    setCatalogOpen(!isCatalogOpen);
  };
  return (
    <header className={styles.header}>
      <Link to="/">
        <img className={styles.icon} src={icon} alt="Icon" />
      </Link>
      <nav className={styles.navigation}>
        <ul>
          <li>
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
        </ul>
      </nav>
      <div className={styles.purchases}>
        <img onClick={handleCartClick} src={cart} alt="cart" />
        <Link to="/favourites">
          <img src="/images/heart.png" alt="selected" />
        </Link>
      </div>
      <Catalog isOpen={isCatalogOpen} toggleCatalog={toggleCatalog} />
    </header>
  );
};

export default Header;
