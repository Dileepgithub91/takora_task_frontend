import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setToken, getToken } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (getToken()) {
          const data = await api('/auth/me');
          setUser(data.user);
        }
      } catch {
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function login(email, password) {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    setToken(data.token);
    setUser(data.user);
  }

  async function forgotPassword(email) {
    return api('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
  }

  async function resetPassword(token, password) {
    return api(`/auth/reset-password/${token}`, { method: 'POST', body: JSON.stringify({ password }) });
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, logout, forgotPassword, resetPassword, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
