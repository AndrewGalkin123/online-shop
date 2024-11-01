import ProductCard from "../../common/ProductCard/ProductCard";
import styles from "./Offer.module.css";
import { useState, useEffect } from "react";
import next from "./next.png";
import prev from "./prev.png";

const Offer = ({ title, products }) => {
  const [currentPage, setCurrentPage] = useState(0); // tracking current page
  const [itemsPerPage, setItemsPerPage] = useState(
    window.innerWidth <= 768 ? 2 : window.innerWidth <= 1300 ? 3 : 4
  );

  // get elements amount according to innerWidth
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(2);
      } else if (window.innerWidth <= 1300) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };

    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // First and last index
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Getting current products
  const currentProducts = products.slice(startIndex, endIndex);

  // Function to switch to prev page
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  //  Function to switch to next page
  const handleNext = () => {
    if (endIndex < products.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className={styles.offer}>
      <div className={styles.galleryControls}>
        <h2 className={styles.offerTitle}>{title}</h2>
        <div>
          <button onClick={handlePrev}>
            <img src={prev} alt="prev" />
          </button>
          <button onClick={handleNext}>
            <img src={next} alt="next" />
          </button>
        </div>
      </div>

      <div className={styles.productCards}>
        {currentProducts.map((el) => (
          <ProductCard
            key={el.id}
            imageSrc={el.imageSrc[0]}
            cardTitle={el.name}
            price={el.price}
            onSale={el.onSale}
            originalPrice={el.originalPrice}
            id={el.id}
            category={el.category}
            animatedCartoon={el.animatedCartoon}
          />
        ))}
      </div>
    </div>
  );
};

export default Offer;
