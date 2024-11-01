import { products } from "../../data/products";
import { useParams, Link } from "react-router-dom";
import styles from "./ProductPage.module.css";
import { convertPath } from "../../utils/utils";
import { useContext, useState } from "react";
import { PurchasesContext } from "../../context/PurchasesContext";

const ProductPage = () => {
  const { product: productId } = useParams();
  const product = products.find((el) => el.id === Number(productId));

  const {
    buyNow,
    addToCart,
    addToSelected,
    selectedItems,
    cartItems,
    removeFromCart,
  } = useContext(PurchasesContext);

  const [mainImageSrc, setMainImageSrc] = useState(
    product ? product.imageSrc[0] : ""
  );
  const isSelected = selectedItems.some((item) => item.id === product?.id);
  const isInCart = cartItems.some((item) => item.id === product?.id);

  if (!product) {
    return (
      <main>
        <p style={{ fontSize: "30px", color: "white", textAlign: "center" }}>
          Product was not found
        </p>
      </main>
    );
  }

  const handleImageClick = (event) => {
    const eventTargetSrc = mainImageSrc;
    setMainImageSrc(event.target.src);
    event.target.src = eventTargetSrc;
  };

  return (
    <main className={styles.main}>
      <nav className={styles.path}>
        <Link to="/">Home / </Link>
        <Link to={`/${product.category}`}>{convertPath(product.category)}</Link>
        {` / ${product.name}`}
      </nav>
      <section className={styles.product}>
        <div className={styles.imagesContainer}>
          <img
            className={styles.mainImage}
            src={mainImageSrc}
            alt={product.name}
          />
          {product.imageSrc.length > 3 && (
            <div className={styles.miniImages}>
              {product.imageSrc.slice(1, 4).map((src, index) => (
                <img
                  key={index}
                  onClick={handleImageClick}
                  className={styles.miniImage}
                  src={src}
                  alt={`miniImage-${index}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className={styles.productDetails}>
          <h1>
            {product.name} from popular animated cartoon{" "}
            {product.animatedCartoon}
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
                  if (isInCart) {
                    removeFromCart(product);
                  } else {
                    addToCart(product);
                  }
                }}
                src={
                  isInCart
                    ? "/images/bag-cross-saved.png"
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
