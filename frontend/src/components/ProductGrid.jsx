import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

/**
 * ProductGrid — renders a responsive grid of ProductCard components.
 *
 * Props:
 *   products  Array of product objects
 */
function ProductGrid({ products }) {
  return (
    <ul className={styles.grid} aria-label="Product listing">
      {products.map((product) => (
        <li key={product.id} className={styles.item}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

export default ProductGrid;
