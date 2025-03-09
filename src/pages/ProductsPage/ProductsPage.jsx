import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import { useParams } from "react-router-dom";
import styles from "./ProductsPage.module.css";
import { convertPath } from "../../utils/utils";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";

const ProductsPage = () => {
  const { products: category } = useParams();
  const { selectedItems } = useContext(UserContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, orderBy("id", "asc"));
        const querySnapshot = await getDocs(q);
        const loadedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(loadedProducts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    category === "favourites"
      ? selectedItems
      : products.filter((product) => product.category === category);

  return (
    <main className={`${styles.catalog}`}>
      <h1 className={styles.title}>{convertPath(category)}</h1>
      <div className={`${styles.products} content`}>
        {filteredProducts.length ? (
          filteredProducts.map((el) => <ProductCard key={el.id} product={el} />)
        ) : (
          <h1 style={{ color: "white" }}>
            {category === "favourites"
              ? ""
              : "No products found in this category."}
          </h1>
        )}
      </div>
    </main>
  );
};

export default ProductsPage;
