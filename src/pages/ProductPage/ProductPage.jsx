import { products } from "../../data/products";
import { useLocation, useParams } from "react-router-dom";
import styles from "./ProductPage.module.css";

const ProductPage = () => {
  const nav = useLocation();
  const location = useParams();
  const product = products.find((el) => el.id === Number(location.product));
  console.log(location);
  return (
    <main>
      <p style={{ color: "#fff" }}>{location.products + "/" + product.name}</p>
      <div className={styles.product}>
        {/* делать подмену фоток от индекса */}
        <div className={styles.image}>
          <img src={product.imageSrc}></img>
          <div className={styles.controlButtons}>
            <button>&#8592;</button> {/* Кнопка "Назад" */}
            <button>&#8594;</button> {/* Кнопка "Вперед" */}
          </div>
        </div>
        <div className={styles.productDetails}>
          <div className={styles.infoAboutProduct}>
            <h1>
              {product.name + " from the popular smartphone game `Azur Lane`"}
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis
              similique nihil veritatis sunt veniam eligendi earum illo eum
              iusto, debitis adipisci fugit delectus aperiam dolorem at.
              Laudantium eligendi soluta ducimus.
            </p>
          </div>
          <div className={styles.purchaseBox}>
            {product.onSale ? (
              <div style={{ display: "flex" }}>
                <div className={styles.prices}>
                  <s className={styles.oldPrice}>{product.originalPrice}¥</s>
                  <p className={styles.actualPrice}>{product.price}¥</p>
                </div>
                <div className={styles.shoppingBox}>
                  <img src="/images/bag-cross-gradient.png" alt="bag"></img>
                  <img src="/images/heart-gradient.png" alt="heart"></img>
                </div>
              </div>
            ) : (
              <div className={styles.prices}>
                <p className={styles.actualPrice}>{product.price}¥</p>
              </div>
            )}

            <button>BUY NOW</button>
          </div>
        </div>
      </div>
      <div className={styles.additionalProducts}></div>
    </main>
  );
};

export default ProductPage;
