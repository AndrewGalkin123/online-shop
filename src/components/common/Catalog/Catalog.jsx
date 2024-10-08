import styles from "./Catalog.module.css";

const Catalog = ({ isOpen, toggleCatalog }) => {
  return (
    <div className={`${styles.catalog} ${isOpen ? styles.catalogOpen : ""}`}>
      <div className={styles.category}>
        <h3>Figures</h3>
        <ul>
          <li>Action figures of characters</li>
          <li>Static figures</li>
          <li>Nendoroids</li>
          <li>Mecha (robots)</li>
        </ul>
      </div>
      <div className={styles.category}>
        <h3>Merchandise</h3>
        <ul>
          <li>Keychains</li>
          <li>Pins</li>
          <li>Posters</li>
          <li>Statues</li>
          <li>Stickers</li>
        </ul>
      </div>
      <div className={styles.category}>
        <h3>Clothing and Accessories</h3>
        <ul>
          <li>T-shirts and hoodies with anime prints</li>
          <li>Hats and caps</li>
          <li>Backpacks and bags</li>
          <li>Scarves, gloves, and socks</li>
        </ul>
      </div>
      <div className={styles.category}>
        <h3>Manga and Artbooks</h3>
        <ul>
          <li>Manga (in different languages)</li>
          <li>Anime and manga artbooks</li>
          <li>Illustrations and posters</li>
        </ul>
      </div>
      <div className={styles.category}>
        <h3>Cosplay and Accessories</h3>
        <ul>
          <li>Character costumes</li>
          <li>Wigs</li>
          <li>Contact lenses</li>
          <li>Cosplay accessories (swords, shields, masks)</li>
        </ul>
      </div>
      <div className={styles.category}>
        <h3>Collectibles</h3>
        <ul>
          <li>Rare editions</li>
          <li>Limited edition figures and posters</li>
          <li>Autographs from creators</li>
        </ul>
      </div>
      <button className={styles.closeButton} onClick={toggleCatalog}>
        <img src="https://png.klev.club/uploads/posts/2024-04/png-klev-club-vmnn-p-belii-krestik-png-20.png"></img>
      </button>
    </div>
  );
};

export default Catalog;
