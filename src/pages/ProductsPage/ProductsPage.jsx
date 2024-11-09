import { useParams } from "react-router-dom";
import { useContext } from "react";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import styles from "./ProductsPage.module.css";
import { convertPath } from "../../utils/utils";
import { products } from "../../data/products";
import { PurchasesContext } from "../../context/PurchasesContext";

const ProductsPage = () => {
  const { products: category } = useParams();
  const { selectedItems } = useContext(PurchasesContext);

  const filteredProducts =
    category === "favourites"
      ? selectedItems
      : products.filter((product) => product.category === category);

  return (
    <main className={styles.catalog}>
      <h1 className={styles.title}>{convertPath(category)}</h1>
      <div className={styles.products}>
        {filteredProducts.length ? (
          filteredProducts.map((el) => <ProductCard key={el.id} product={el} />)
        ) : (
          <h1 style={{ color: "white" }}>
            No products found in this category.
          </h1>
        )}
      </div>
    </main>
  );
};

export default ProductsPage;
