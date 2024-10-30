import ProductCard from "../../common/ProductCard/ProductCard";
import styles from "./Offer.module.css";
import { useState, useEffect } from "react";
import next from "./next.png";
import prev from "./prev.png";

const Offer = ({ title, products }) => {
  const [currentPage, setCurrentPage] = useState(0); // состояние для отслеживания текущей страницы
  const [itemsPerPage, setItemsPerPage] = useState(
    window.innerWidth <= 768 ? 2 : window.innerWidth <= 1300 ? 3 : 4
  );

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

  // Рассчитываем индекс первого и последнего элемента на текущей странице
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Извлекаем текущие продукты для отображения
  const currentProducts = products.slice(startIndex, endIndex);

  // Функция для переключения на предыдущую страницу
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Функция для переключения на следующую страницу
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
            <img src={prev} />
          </button>
          <button onClick={handleNext}>
            <img src={next} />
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
          />
        ))}
      </div>
    </div>
  );
};

export default Offer;
