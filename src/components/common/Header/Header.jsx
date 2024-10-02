import styles from "./Header.module.css";
import icon from "./icon.png";
import cart from "./bag-cross.png";
import selected from "./heart.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/">
        <img className={styles.icon} src={icon} alt="Icon" />
      </Link>
      <nav className={styles.navigation}>
        <ul>
          <li>
            <Link to="*">Catalog</Link>
          </li>
          <li>
            <Link to="/newcollection">New collections</Link>
          </li>
          <li>
            <Link to="#">Best Sellings</Link>
          </li>
          <li>
            <Link to="/sale">Sale</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.purchases}>
        <img src={cart} alt="cart" />
        <img src={selected} alt="selected" />
      </div>
    </header>
  );
};

export default Header;
