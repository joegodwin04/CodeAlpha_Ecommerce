import { createContext, useContext, useState, useCallback } from 'react';

/**
 * AuthContext — provides authentication state to the entire app.
 *
 * Stored state:
 *   token  {string|null}  — JWT returned by the API
 *   user   {Object|null}  — { id, name, email, createdAt }
 *
 * Token is persisted in localStorage so it survives page refreshes.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialise from localStorage on first render
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user,  setUser]  = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  /** Called after a successful register or login API response */
  const login = useCallback((newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user',  JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  /** Clear session data */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const isLoggedIn = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — consume AuthContext anywhere in the tree.
 * Returns: { token, user, isLoggedIn, login, logout }
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
