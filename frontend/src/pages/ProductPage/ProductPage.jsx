import { useParams, Link } from "react-router-dom";
import styles from "./ProductPage.module.css";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import {getProductById} from "../../api/productsApi";
import {showToast} from "../../utils/toast";
import ReviewSection from "../../components/common/ReviewSection/ReviewSection";

// "size": "Big","Small" , "Medium" , "Large"
//     "rarity": "Common", "Uncommon" "Rare" "Limited"
//     "quality": "Medium", "High" "Normal" "Bad"
//     "manufacturer": "GoodSmile Company",
//     "animatedCartoon": "Demon Slayer"

const ProductPage = () => {
  const { product: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImageSrc, setMainImageSrc] = useState("");

  // После получения продукта парсим attributes
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        // Парсим attributes из JSON строки в объект
        if (data.attributes && typeof data.attributes === "string") {
          data.attributes = JSON.parse(data.attributes);
        }
        setProduct(data);
        setMainImageSrc(data.images[0]);
      } catch (error) {
        showToast("Error fetching product:", error);
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

  const isSelected = selectedItems.some((id) => id === productId);
  const isInCart = cartItems.some((item) => item.productId === product?.id);

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

  // Добавить возможность выбора количества продуктов которые мы хотим добавить в корзину

  return (
    <main className={styles.main}>
      {/* Navigation path */}
      <nav className={styles.path}>
        <Link to="/">Home / </Link>
        <Link to={`/${product.categorySlug}`}>{product.categoryName}</Link>
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
          {product.images.length > 3 && (
            <div className={styles.miniImages}>
              {product.images.slice(1, 4).map((src, index) => (
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
            {product.attributes?.animatedCartoon}
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
                  onClick={async () => {
                    if (isInCart) {
                      await removeFromCart({id: product.id});
                    } else {
                      try {
                        await addToCart(product);
                        showToast("Added to cart!", "success");
                      } catch (err) {
                        showToast(err.message, "error");
                      }
                    }
                  }}
                  src={isInCart ? "/images/bag-cross-saved.png" : "/images/bag-cross-gradient.png"}
                  alt="bag"
              />

              <img
                  onClick={() => addToSelected(productId)}
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
          <button onClick={async () => {
            try {
              await buyNow(product);
            } catch (err) {
              showToast(err.message, "error");
            }
          }}>
            BUY NOW
          </button>
        </div>
      </section>
      <ReviewSection productId={product?.id} />

      {/* Section for additional products (currently empty) */}
      <div className={styles.additionalProducts}></div>
    </main>
  );
};

export default ProductPage;
