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

  const { buyNow, addToCart, addToSelected, selectedItems } =
    useContext(PurchasesContext);

  const [mainImageSrc, setMainImageSrc] = useState(product.imageSrc[0]);
  const isSelected = selectedItems.some((item) => item.id === product.id);
  const handleImageClick = (event) => {
    const eventTargetSrc = mainImageSrc;
    setMainImageSrc(event.target.src); // Setting image
    event.target.src = eventTargetSrc;
  };

  return (
    <main className={styles.main}>
      <div className={styles.path}>
        <Link to="/">Home/ </Link>
        <Link to={`/${location.products}`}>
          {convertPath(location.products)}
        </Link>
        {"/ " + product.name}
      </div>
      <div className={styles.product}>
        <div className={styles.imagesContainer}>
          <div className={styles.images}>
            <img id={styles.mainImage} src={mainImageSrc} alt="mainImage" />
            <img
              onClick={handleImageClick}
              className={styles.miniImages}
              src={product.imageSrc[1]}
              alt="miniImage"
            />
            <img
              onClick={handleImageClick}
              className={styles.miniImages}
              src={product.imageSrc[2]}
              alt="miniImage"
            />
            <img
              onClick={handleImageClick}
              className={styles.miniImages}
              src={product.imageSrc[3]}
              alt="miniImage"
            />
          </div>
        </div>
        <div className={styles.productDetails}>
          <div className={styles.infoAboutProduct}>
            <h1>
              {product.name + " from the popular smartphone game 'Azur Lane'"}
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
                  <img
                    onClick={() => addToCart(product)}
                    src="/images/bag-cross-gradient.png"
                    alt="bag"
                  ></img>
                  <img
                    onClick={() => addToSelected(product)}
                    src={
                      isSelected
                        ? "/images/heart-saved.png"
                        : "/images/heart-gradient.png"
                    }
                    alt="heart"
                  ></img>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex" }}>
                <div className={styles.prices}>
                  <p className={styles.actualPrice}>{product.price}¥</p>
                </div>
                <div className={styles.shoppingBox}>
                  <img
                    onClick={() => addToCart(product)}
                    src="/images/bag-cross-gradient.png"
                    alt="bag"
                  ></img>
                  <img
                    onClick={() => addToSelected(product)}
                    src={
                      isSelected
                        ? "/images/heart-saved.png"
                        : "/images/heart-gradient.png"
                    }
                    alt="heart"
                  ></img>
                </div>
              </div>
            )}

            <button onClick={() => buyNow(product)}>BUY NOW</button>
          </div>
        </div>
      </div>
      <div className={styles.additionalProducts}></div>
    </main>
  );
};

export default ProductPage;
