import ProductCard from "../../components/common/ProductCard/ProductCard";
import { products } from "../../data/products";
import { useParams } from "react-router-dom";
import styles from "./ProductsPage.module.css";
import { convertPath } from "../../utils/utils";

const ProductsPage = () => {
  const category = useParams();

  const filteredProducts = products.filter(
    (product) => product.category === category.products
  );

  return (
    <div className={styles.catalog}>
      <h1 className={styles.title}>{convertPath(category.products)}</h1>
      <div className={styles.products}>
        {filteredProducts.map((el) => (
          <ProductCard
            imageSrc={el.imageSrc[0]}
            onSale={el.onSale}
            cardTitle={el.name}
            price={el.price}
            originalPrice={el.originalPrice}
            id={el.id}
            category={el.category}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
