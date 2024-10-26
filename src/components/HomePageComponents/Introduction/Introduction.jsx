import styles from "./Introduction.module.css";
import animeFigure from "./AnimeFigure1.jpg";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { PurchasesContext } from "../../../context/PurchasesContext";

const Introduction = () => {
  const { buyNow } = useContext(PurchasesContext);

  return (
    <article className={styles.introduction}>
      <div className={styles.attractionBlock}>
        <p>IMMERSE YOURSELF IN THE WORLD OF JAPANESE CULTURE WITH NEKON</p>

        <button>OUR CATALOG</button>
      </div>
      <div className={styles.card}>
        <Link to="/forAdults/46">
          <img src={animeFigure} alt={"Senhime"} />
        </Link>
        <div className={styles.purchaseBox}>
          <div className={styles.cardDescription}>
            <p className={styles.cardTitle}>Leviathan Yukano</p>
            <div className={styles.prices}>
              <p className={styles.actualPrice}>1099¥</p>
              <s className={styles.oldPrice}>1399¥</s>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              buyNow({
                id: 46,
                name: "Leviathan Yukano",
                price: 1099,
                originalPrice: 1399,
                onSale: true,
                category: "forAdults",
                imageSrc: animeFigure ? [animeFigure] : [],
              });
            }}
          >
            BUY NOW
          </button>
        </div>
      </div>
    </article>
  );
};

export default Introduction;
