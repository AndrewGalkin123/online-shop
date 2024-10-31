import { useState, useEffect, useRef } from "react";
import styles from "./Catalog.module.css";
import { Link } from "react-router-dom";

const Catalog = ({ isOpen, toggleCatalog }) => {
  const [openCategories, setOpenCategories] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const catalogRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Обработчик клика вне каталога
    const handleClickOutside = (event) => {
      if (catalogRef.current && !catalogRef.current.contains(event.target)) {
        toggleCatalog(); // Закрыть каталог при клике вне его
      }
    };

    if (isOpen) {
      // Если каталог открыт, добавляем обработчик клика
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Если каталог закрыт, удаляем обработчик
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside); // Удаляем обработчик при размонтировании
    };
  }, [isOpen, toggleCatalog]); // Добавляем isOpen в зависимости

  const toggleCategory = (category) => {
    if (isMobile) {
      setOpenCategories((prev) => ({
        ...prev,
        [category]: !prev[category],
      }));
    }
  };

  return (
    <div
      ref={catalogRef}
      className={`${styles.catalog} ${isOpen ? styles.catalogOpen : ""}`}
    >
      <div className={styles.category}>
        <h3 onClick={() => toggleCategory("figures")}>Figures</h3>
        {(isMobile && openCategories.figures) || !isMobile ? (
          <ul className={openCategories.figures ? styles.show : ""}>
            <Link to="/nendoroids">
              <li>Nendoroids</li>
            </Link>
            <Link to="/animeDolls">
              <li>Anime dolls</li>
            </Link>
            <Link to="/forAdults">
              <li>For Adults (18+)</li>
            </Link>
          </ul>
        ) : null}
      </div>

      <div className={styles.category}>
        <h3 onClick={() => toggleCategory("merchandise")}>Merchandise</h3>
        {(isMobile && openCategories.merchandise) || !isMobile ? (
          <ul className={openCategories.merchandise ? styles.show : ""}>
            <Link to="/keychains">
              <li>Keychains</li>
            </Link>
            <Link to="/pins">
              <li>Pins</li>
            </Link>
            <Link to="/posters">
              <li>Posters</li>
            </Link>
          </ul>
        ) : null}
      </div>

      <div className={styles.category}>
        <h3 onClick={() => toggleCategory("clothing")}>
          Clothing and Accessories
        </h3>
        {(isMobile && openCategories.clothing) || !isMobile ? (
          <ul className={openCategories.clothing ? styles.show : ""}>
            <Link to="/t-shirts">
              <li>T-shirts with anime prints</li>
            </Link>

            <Link to="">
              <li>Backpacks and bags</li>
            </Link>
            <Link to="">
              <li>Scarves, gloves, and socks</li>
            </Link>
          </ul>
        ) : null}
      </div>

      <div className={styles.category}>
        <h3 onClick={() => toggleCategory("manga")}>Manga and Artbooks</h3>
        {(isMobile && openCategories.manga) || !isMobile ? (
          <ul className={openCategories.manga ? styles.show : ""}>
            <Link to="">
              <li>Manga (in different languages)</li>
            </Link>
            <Link to="">
              <li>Anime and manga artbooks</li>
            </Link>
            <Link to="/posters">
              <li>Illustrations and posters</li>
            </Link>
          </ul>
        ) : null}
      </div>

      <div className={styles.category}>
        <h3 onClick={() => toggleCategory("collectibles")}>Collectibles</h3>
        {(isMobile && openCategories.collectibles) || !isMobile ? (
          <ul className={openCategories.collectibles ? styles.show : ""}>
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
        ) : null}
      </div>

      <button className={styles.closeButton} onClick={toggleCatalog}>
        <img
          src="https://png.klev.club/uploads/posts/2024-04/png-klev-club-vmnn-p-belii-krestik-png-20.png"
          alt="Close"
        />
      </button>
    </div>
  );
};

export default Catalog;
