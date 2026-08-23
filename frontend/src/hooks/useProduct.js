import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * useProduct — custom hook that fetches a single product by ID.
 *
 * @param {string|number} id  — the product ID from the URL param
 * Returns: { product, loading, error }
 */
function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);

      try {
        const response = await fetch(`${API_BASE}/api/products/${id}`);
        const json     = await response.json();

        if (!response.ok) {
          // Use the server's own error message when available
          throw new Error(
            json.message || `Server responded with status ${response.status}`
          );
        }

        if (!cancelled) {
          setProduct(json.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              'Something went wrong while loading this product. Please try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, loading, error };
}

export default useProduct;
