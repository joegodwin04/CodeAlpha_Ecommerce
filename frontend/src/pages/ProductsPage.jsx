import { useState } from 'react';
import { Headphones, Cpu, Wifi, Watch, Gamepad2, Monitor, Smartphone } from 'lucide-react';
import useProducts from '../hooks/useProducts';
import ProductGrid from '../components/ProductGrid';
import LoadingGrid from '../components/LoadingGrid';
import ErrorState  from '../components/ErrorState';
import EmptyState  from '../components/EmptyState';
import styles from './ProductsPage.module.css';

const CATEGORIES = [
  { name: 'Audio',               icon: Headphones },
  { name: 'Computer Accessories', icon: Cpu },
  { name: 'Workspace',           icon: Monitor },
  { name: 'Mobile Accessories',  icon: Smartphone },
  { name: 'Wearables',          icon: Watch },
  { name: 'Gaming',             icon: Gamepad2 },
  { name: 'Networking',         icon: Wifi },
];

function ProductsPage() {
  const { products, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <main className={styles.page}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Welcome to TechStore">
        <div className="container">
          <div className={styles.heroGrid}>

            {/* Left: copy */}
            <div className={styles.heroCopy}>
              <div className={styles.heroEyebrow}>Premium Tech, Delivered</div>
              <h1 className={styles.heroTitle}>
                Power Up<br />
                <span className={styles.heroTitleAccent}>Your Everyday.</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Discover smarter technology and premium accessories designed for
                work, entertainment, and everyday life.
              </p>
              <div className={styles.heroActions}>
                <a href="#catalog" className={styles.heroCta}>
                  Shop Now
                </a>
                <span className={styles.heroStat}>
                  <strong>{products.length || '25'}+</strong> products in stock
                </span>
              </div>
            </div>

            {/* Right: visual focal point — product cards mosaic */}
            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.heroCard} data-pos="tl">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80"
                  alt=""
                  className={styles.heroCardImg}
                />
                <span className={styles.heroCardTag}>Audio</span>
              </div>
              <div className={styles.heroCard} data-pos="tr">
                <img
                  src="https://images.unsplash.com/photo-1595225476474-87563907a212?w=300&q=80"
                  alt=""
                  className={styles.heroCardImg}
                />
                <span className={styles.heroCardTag}>Gaming</span>
              </div>
              <div className={styles.heroCard} data-pos="bl">
                <img
                  src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&q=80"
                  alt=""
                  className={styles.heroCardImg}
                />
                <span className={styles.heroCardTag}>Wearables</span>
              </div>
              <div className={styles.heroCard} data-pos="br">
                <img
                  src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80"
                  alt=""
                  className={styles.heroCardImg}
                />
                <span className={styles.heroCardTag}>Workspace</span>
              </div>
              {/* Decorative ring */}
              <div className={styles.heroRing} />
            </div>

          </div>
        </div>
      </section>

      {/* ── Category Nav ─────────────────────────────────────────────────── */}
      <section className={styles.categorySection} aria-label="Browse by category">
        <div className="container">
          <div className={styles.categoryScroll} role="list">
            <button
              role="listitem"
              className={`${styles.chip} ${!selectedCategory ? styles.chipActive : ''}`}
              onClick={() => setSelectedCategory(null)}
              aria-pressed={!selectedCategory}
            >
              All Products
            </button>
            {CATEGORIES.map(({ name, icon: Icon }) => (
              <button
                role="listitem"
                key={name}
                className={`${styles.chip} ${selectedCategory === name ? styles.chipActive : ''}`}
                onClick={() => setSelectedCategory(name)}
                aria-pressed={selectedCategory === name}
              >
                <Icon size={14} strokeWidth={2} aria-hidden="true" />
                {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product catalog ───────────────────────────────────────────────── */}
      <section id="catalog" className={styles.catalogSection} aria-label="Product catalog">
        <div className="container">
          <div className={styles.catalogHeader}>
            <div>
              <h2 className={styles.catalogTitle}>
                {selectedCategory ? selectedCategory : 'Explore Our Collection'}
              </h2>
              {!loading && !error && (
                <p className={styles.catalogSubtitle}>
                  {selectedCategory
                    ? `Showing all ${filteredProducts.length} products in ${selectedCategory}`
                    : `${filteredProducts.length} products — updated daily`
                  }
                </p>
              )}
            </div>
            {selectedCategory && (
              <button
                className={styles.clearFilter}
                onClick={() => setSelectedCategory(null)}
              >
                Clear filter ×
              </button>
            )}
          </div>

          {loading && <LoadingGrid count={8} />}

          {!loading && error && (
            <ErrorState message={error} onRetry={() => window.location.reload()} />
          )}

          {!loading && !error && filteredProducts.length === 0 && <EmptyState />}

          {!loading && !error && filteredProducts.length > 0 && (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </section>

    </main>
  );
}

export default ProductsPage;
