import ProductCard from "../common/ProductCard/ProductCard";
import styles from "./Offer.module.css";

let arr = [1, 2, 3, 4];
const Offer = () => {
  return (
    <div className={styles.offer}>
      <div className={styles.galleryControls}>
        <h2 className={styles.offerTitle}>NEW COLLECTION</h2>
        <div>
          <button>&#8592;</button>
          <button>&#8594;</button>
        </div>
      </div>

      <div className={styles.productCards}>
        {arr.map((el) => (
          <ProductCard />
        ))}
      </div>
    </div>
  );
};

export default Offer;
