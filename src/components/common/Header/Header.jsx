import styles from "./Header.module.css";
import icon from "./icon.png";
import cart from "./bag-cross.png";
import burgerMenu from "./menu.png";
import { Link } from "react-router-dom";
import Catalog from "../Catalog/Catalog";
import { useContext, useState } from "react";
import { PurchasesContext } from "../../../context/PurchasesContext";

const Header = ({ isCatalogOpen, setCatalogStatus }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { setCartStatus } = useContext(PurchasesContext);

  const handleCartClick = () => {
    setCartStatus(true);
  };

  const toggleCatalog = () => {
    setCatalogStatus(!isCatalogOpen);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
    setCatalogStatus(false);
  };

  return (
    <header className={styles.header}>
      <Link to="/">
        <img className={styles.icon} src={icon} alt="Icon" />
      </Link>
      <nav className={`${styles.navigation} ${isMenuOpen ? styles.open : ""}`}>
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
          {/* Показываем Cart и Favourites только при открытом меню на мобильных */}
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
        <img onClick={handleCartClick} src={cart} alt="cart" />
        <Link to="/favourites">
          <img src="/images/heart.png" alt="selected" />
        </Link>
      </div>
      <button className={styles.burger} onClick={toggleMenu}>
        <img src={burgerMenu} alt="menu" />
      </button>
      {/* Оверлей, который затемняет фон при открытии меню */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={toggleMenu}></div>
      )}
      <Catalog isOpen={isCatalogOpen} toggleCatalog={toggleCatalog} />
    </header>
  );
};

export default Header;
