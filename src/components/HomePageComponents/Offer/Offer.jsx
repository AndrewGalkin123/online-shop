import ProductCard from "../../common/ProductCard/ProductCard";
import styles from "./Offer.module.css";
import { useState, useEffect } from "react";
import next from "./next.png";
import prev from "./prev.png";

// Custom hook to calculate items per page based on screen width
const useItemsPerPage = () => {
  const getItemsPerPage = () => {
    if (window.innerWidth <= 768) return 2;
    if (window.innerWidth <= 1300) return 3;
    return 4;
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);

  useEffect(() => {
    const updateItemsPerPage = () => setItemsPerPage(getItemsPerPage());

    const debouncedResize = debounce(updateItemsPerPage, 100);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  return itemsPerPage;
};

const Offer = ({ title, products }) => {
  const itemsPerPage = useItemsPerPage();
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate start and end index based on current page and items per page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  // Handle previous and next page actions
  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (endIndex < products.length) setCurrentPage(currentPage + 1);
  };

  return (
    <div className={`${styles.offer} content`}>
      <div className={styles.galleryControls}>
        <h2 className={styles.offerTitle}>{title}</h2>
        <div>
          <button onClick={handlePrev} disabled={currentPage === 0}>
            <img src={prev} alt="Previous" />
          </button>
          <button onClick={handleNext} disabled={endIndex >= products.length}>
            <img src={next} alt="Next" />
          </button>
        </div>
      </div>

      <div className={styles.productCards}>
        {currentProducts.map((el) => (
          <ProductCard key={el.id} product={el} />
        ))}
      </div>
    </div>
  );
};

export default Offer;

// Utility function for debounce
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
