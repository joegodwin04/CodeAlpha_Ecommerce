import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * CartContext — provides global cart state and API helpers.
 *
 * Exposed:
 *   items        Array of cart items (with product data)
 *   itemCount    Total number of individual items (sum of quantities)
 *   total        Cart grand total (number)
 *   loading      Boolean — API request in progress
 *   error        String|null — last API error message
 *   fetchCart()  Re-fetch cart from backend
 *   addItem(productId, qty)
 *   updateItem(productId, qty)
 *   removeItem(productId)
 *   clearCart()
 */

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token, isLoggedIn } = useAuth();

  const [items,     setItems]     = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  /** Merge API cart data into state */
  const applyCartData = useCallback((data) => {
    setItems(data.items       ?? []);
    setItemCount(data.itemCount ?? 0);
    setTotal(data.total        ?? 0);
  }, []);

  /** Authenticated fetch helper */
  const authFetch = useCallback(
    (url, options = {}) =>
      fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      }),
    [token]
  );

  /** Fetch the cart from the backend */
  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      applyCartData({ items: [], itemCount: 0, total: 0 });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res  = await authFetch(`${API_BASE}/api/cart`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      applyCartData(json.data);
    } catch (err) {
      setError(err.message || 'Failed to load cart.');
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, authFetch, applyCartData]);

  // Fetch cart whenever the user logs in / out
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /** Add a product (or increment quantity) */
  const addItem = useCallback(async (productId, quantity = 1) => {
    if (!isLoggedIn) {
      return { success: false, message: 'Please log in to add items to your cart.', needAuth: true };
    }
    setLoading(true);
    setError(null);
    try {
      const res  = await authFetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        body:   JSON.stringify({ productId, quantity }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      applyCartData(json.data);
      return { success: true, message: json.message };
    } catch (err) {
      const msg = err.message || 'Failed to add item to cart.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, authFetch, applyCartData]);

  /** Set exact quantity for a cart item */
  const updateItem = useCallback(async (productId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      const res  = await authFetch(`${API_BASE}/api/cart/${productId}`, {
        method: 'PUT',
        body:   JSON.stringify({ quantity }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      applyCartData(json.data);
      return { success: true, message: json.message };
    } catch (err) {
      const msg = err.message || 'Failed to update item.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [authFetch, applyCartData]);

  /** Remove a single item */
  const removeItem = useCallback(async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const res  = await authFetch(`${API_BASE}/api/cart/${productId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      applyCartData(json.data);
      return { success: true, message: json.message };
    } catch (err) {
      const msg = err.message || 'Failed to remove item.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [authFetch, applyCartData]);

  /** Clear entire cart */
  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await authFetch(`${API_BASE}/api/cart`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      applyCartData(json.data);
      return { success: true, message: json.message };
    } catch (err) {
      const msg = err.message || 'Failed to clear cart.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [authFetch, applyCartData]);

  return (
    <CartContext.Provider
      value={{ items, itemCount, total, loading, error, fetchCart, addItem, updateItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

/** useCart — consume CartContext anywhere in the tree */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
