import styles from "./Header.module.css";
import icon from "./icon.png";
import cart from "./bag-cross.png";
import selected from "./heart.png";

const Header = () => {
  return (
    <header className={styles.header}>
      <img className={styles.icon} src={icon} alt="Icon" />
      <nav className={styles.navigation}>
        <ul>
          <li>
            <a href="#">Catalog</a>
          </li>
          <li>
            <a href="#">New collections</a>
          </li>
          <li>
            <a href="#">Best Sellings</a>
          </li>
          <li>
            <a href="#">Sale</a>
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
