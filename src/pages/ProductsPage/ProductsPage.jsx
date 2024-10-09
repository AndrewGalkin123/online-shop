import ProductCard from "../../components/common/ProductCard/ProductCard";
import { products } from "../../data/products";
import { useParams } from "react-router-dom";
import styles from "./ProductsPage.module.css";

const ProductsPage = () => {
  const category = useParams();

  const filteredProducts = products.filter(
    (product) => product.category === category.products
  );
  console.log(filteredProducts);
  return (
    <div className={styles.catalog}>
      <h1 className={styles.title}>Products</h1>
      <div className={styles.products}>
        {filteredProducts.map((el) => (
          <ProductCard
            imageSrc={el.imageSrc}
            onSale={el.onSale}
            cardTitle={el.name}
            price={el.price}
            originalPrice={el.originalPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
