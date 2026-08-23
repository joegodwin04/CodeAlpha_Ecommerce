import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * useProducts — custom hook that fetches all products from the backend.
 *
 * Returns: { products, loading, error }
 */
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let cancelled = false; // prevent state updates if the component unmounts

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/api/products`);

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const json = await response.json();

        if (!cancelled) {
          setProducts(json.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              'Something went wrong while fetching products. Please try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true; // cleanup on unmount
    };
  }, []);

  return { products, loading, error };
}

export default useProducts;
