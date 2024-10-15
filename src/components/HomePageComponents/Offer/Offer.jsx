import ProductCard from "../../common/ProductCard/ProductCard";
import styles from "./Offer.module.css";
import { useState } from "react";

const Offer = ({ title, products }) => {
  const [currentPage, setCurrentPage] = useState(0); // состояние для отслеживания текущей страницы
  const itemsPerPage = 4; // Количество элементов на странице

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
          <button onClick={handlePrev}>&#8592;</button> {/* Кнопка "Назад" */}
          <button onClick={handleNext}>&#8594;</button> {/* Кнопка "Вперед" */}
        </div>
      </div>

      <div className={styles.productCards}>
        {currentProducts.map((el) => (
          <ProductCard
            key={el.id}
            imageSrc={el.imageSrc}
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
