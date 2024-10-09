import styles from "./Header.module.css";
import icon from "./icon.png";
import cart from "./bag-cross.png";
import selected from "./heart.png";
import { Link } from "react-router-dom";
import Catalog from "../Catalog/Catalog";
import { useState } from "react";

const Header = () => {
  const [isCatalogOpen, setCatalogOpen] = useState(false);

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
            <Link to="/">New collections</Link>
          </li>
          <li>
            <Link to="#">Best Sellings</Link>
          </li>
          <li>
            <Link to="/anime">Sale</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.purchases}>
        <img src={cart} alt="cart" />
        <img src={selected} alt="selected" />
      </div>
      <Catalog isOpen={isCatalogOpen} toggleCatalog={toggleCatalog} />
    </header>
  );
};

export default Header;
