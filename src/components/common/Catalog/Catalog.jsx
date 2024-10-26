import styles from "./Catalog.module.css";
import { Link } from "react-router-dom";

const Catalog = ({ isOpen, toggleCatalog }) => {
  return (
    <div className={`${styles.catalog} ${isOpen ? styles.catalogOpen : ""}`}>
      <div className={styles.category}>
        <h3>Figures</h3>
        <ul>
          <Link to="/nendoroids">
            <li>Nendoroids</li>
          </Link>
          <Link to="/animeDolls">
            <li>Anime dolls</li>
          </Link>
          <Link to="/forAdults">
            <li>For Adults (18+)</li>
          </Link>
          <Link to="/mecha">
            <li>Mecha (robots)</li>
          </Link>
        </ul>
      </div>
      <div className={styles.category}>
        <h3>Merchandise</h3>
        <ul>
          <Link to="">
            <li>Keychains</li>
          </Link>
          <Link to="">
            <li>Pins</li>
          </Link>
          <Link to="">
            <li>Posters</li>
          </Link>
          <Link to="">
            <li>Statues</li>
          </Link>
          <Link to="">
            <li>Stickers</li>
          </Link>
        </ul>
      </div>
      <div className={styles.category}>
        <h3>Clothing and Accessories</h3>
        <ul>
          <Link to="">
            <li>T-shirts and hoodies with anime prints</li>
          </Link>
          <Link to="">
            <li>Hats and caps</li>
          </Link>
          <Link to="">
            <li>Backpacks and bags</li>
          </Link>
          <Link to="">
            <li>Scarves, gloves, and socks</li>
          </Link>
        </ul>
      </div>
      <div className={styles.category}>
        <h3>Manga and Artbooks</h3>
        <ul>
          <Link to="">
            <li>Manga (in different languages)</li>
          </Link>
          <Link to="">
            <li>Anime and manga artbooks</li>
          </Link>
          <Link to="">
            <li>Illustrations and posters</li>
          </Link>
        </ul>
      </div>
      <div className={styles.category}>
        <h3>Cosplay and Accessories</h3>
        <ul>
          <Link to="">
            <li>Character costumes</li>
          </Link>
          <Link to="">
            <li>Wigs</li>
          </Link>
          <Link to="">
            <li>Contact lenses</li>
          </Link>
          <Link to="">
            <li>Cosplay accessories (swords, shields, masks)</li>
          </Link>
        </ul>
      </div>
      <div className={styles.category}>
        <h3>Collectibles</h3>
        <ul>
          <Link to="">
            <li>Rare editions</li>
          </Link>
          <Link to="/limitedEditionFigures">
            <li>Limited edition figures</li>
          </Link>
          <Link to="">
            <li>Autographs from creators</li>
          </Link>
        </ul>
      </div>
      <button className={styles.closeButton} onClick={toggleCatalog}>
        <img src="https://png.klev.club/uploads/posts/2024-04/png-klev-club-vmnn-p-belii-krestik-png-20.png"></img>
      </button>
    </div>
  );
};

export default Catalog;
