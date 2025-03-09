import { useParams, Link } from "react-router-dom";
import styles from "./ProductPage.module.css";
import { convertPath } from "../../utils/utils";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const ProductPage = () => {
  const { product: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImageSrc, setMainImageSrc] = useState(""); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", productId);
        const docSnap = await getDoc(productRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
          setMainImageSrc(docSnap.data().imageSrc[0]); 
        } else {
          console.log("No product found with this ID");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const {
    buyNow,
    addToCart,
    addToSelected,
    selectedItems,
    cartItems,
    removeFromCart,
  } = useContext(UserContext);

  const isSelected = selectedItems.some((item) => item.id === product?.id);
  const isInCart = cartItems.some((item) => item.id === product?.id);

  // Scroll to top when the component is mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle image click to swap main image with clicked mini image
  const handleImageClick = (event) => {
    const eventTargetSrc = mainImageSrc;
    setMainImageSrc(event.target.src);
    event.target.src = eventTargetSrc;
  };

  // Early return if product is not found
  if (!product) {
    return (
      <main>
        <p style={{ fontSize: "30px", color: "white", textAlign: "center" }}>
          Loading product...
        </p>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      {/* Navigation path */}
      <nav className={styles.path}>
        <Link to="/">Home / </Link>
        <Link to={`/${product.category}`}>{convertPath(product.category)}</Link>
        {` / ${product.name}`}
      </nav>

      <section className={styles.product}>
        {/* Image gallery */}
        <div className={styles.imagesContainer}>
          <img
            className={styles.mainImage}
            src={mainImageSrc}
            alt={product.name}
          />

          {/* Show mini images if there are more than 3 */}
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

        {/* Product details */}
        <div className={styles.productDetails}>
          <h1>
            {product.name} from the popular animated cartoon{" "}
            {product.animatedCartoon}
          </h1>
          <p>{product.description}</p>

          {/* Purchase box */}
          <div className={styles.purchaseBox}>
            <div className={styles.prices}>
              {product.onSale && (
                <s className={styles.oldPrice}>{product.originalPrice}¥</s>
              )}
              <span className={styles.actualPrice}>{product.price}¥</span>
            </div>

            {/* Shopping box with cart and favorite buttons */}
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

          {/* Buy now button */}
          <button onClick={() => buyNow(product)}>BUY NOW</button>
        </div>
      </section>

      {/* Section for additional products (currently empty) */}
      <div className={styles.additionalProducts}></div>
    </main>
  );
};

export default ProductPage;
