import { products } from "../../data/products";
import { useParams } from "react-router-dom";
import styles from "./ProductPage.module.css";
import { convertPath } from "../../utils/utils";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { PurchasesContext } from "../../context/PurchasesContext";

const ProductPage = () => {
  const location = useParams();
  const product = products.find((el) => el.id === Number(location.product));

  const { buyNow, addToCart, addToSelected, selectedItems, cartItems } =
    useContext(PurchasesContext);

  const [mainImageSrc, setMainImageSrc] = useState(product.imageSrc[0]);
  const isSelected = selectedItems.some((item) => item.id === product.id);
  const isInCart = cartItems.some((item) => item.id === product.id);
  const handleImageClick = (event) => {
    const eventTargetSrc = mainImageSrc;
    setMainImageSrc(event.target.src);
    event.target.src = eventTargetSrc;
  };

  return (
    <main className={styles.main}>
      <nav className={styles.path}>
        <Link to="/">Home / </Link>
        <Link to={`/${location.products}`}>
          {convertPath(location.products)}
        </Link>
        {"/ " + product.name}
      </nav>
      <section className={styles.product}>
        <div className={styles.imagesContainer}>
          <img className={styles.mainImage} src={mainImageSrc} alt="main" />
          {product.imageSrc.length > 3 ? (
            <div className={styles.miniImages}>
              <img
                onClick={handleImageClick}
                className={styles.miniImage}
                src={product.imageSrc[1]}
                alt="miniImage"
              />
              <img
                onClick={handleImageClick}
                className={styles.miniImage}
                src={product.imageSrc[2]}
                alt="miniImage"
              />
              <img
                onClick={handleImageClick}
                className={styles.miniImage}
                src={product.imageSrc[3]}
                alt="miniImage"
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={styles.productDetails}>
          <h1>
            {product.name} from popular anime {product.animeName}
          </h1>
          <p>{product.description}</p>
          <div className={styles.purchaseBox}>
            <div className={styles.prices}>
              {product.onSale && (
                <s className={styles.oldPrice}>{product.originalPrice}¥</s>
              )}
              <span className={styles.actualPrice}>{product.price}¥</span>
            </div>
            <div className={styles.shoppingBox}>
              <img
                onClick={() => {
                  if (!cartItems.includes(product)) {
                    addToCart(product);
                  }
                }}
                src={
                  isInCart
                    ? "/images/bag-cross.png"
                    : "/images/bag-cross-gradient.png"
                }
                alt="bag"
              />
              <img
                onClick={() => addToSelected(product)}
                src={
                  isSelected
                    ? "/images/heart-saved.png"
                    : "/images/heart-gradient.png"
                }
                alt="heart"
              />
            </div>
          </div>
          <button onClick={() => buyNow(product)}>BUY NOW</button>
        </div>
      </section>
      <div className={styles.additionalProducts}></div>
    </main>
  );
};

export default ProductPage;
