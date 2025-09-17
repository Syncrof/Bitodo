import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/authService';
import { setOnUnauthorized } from '../apiClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadMe = useCallback(async () => {
    setLoading(true);
    const res = await authService.me();
    if (res.success) setUser(res.data);
    else setUser(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  useEffect(() => {
    // Register global unauthorized handler to force logout
    setOnUnauthorized(() => {
      // clear local user and navigate to login
      setUser(null);
      try { navigate('/login'); } catch (e) { /* ignore if not mounted */ }
    });
    return () => setOnUnauthorized(null);
  }, [navigate]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success) {
      // server sets cookie; refresh user
      await loadMe();
    }
    return res;
  };

  const register = async (credentials) => {
    const res = await authService.register(credentials);
    if (res.success) {
      await loadMe();
    }
    return res;
  };

  const logout = async () => {
    const res = await authService.logout();
    setUser(null);
    try { navigate('/login'); } catch (e) { /**/ }
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, reload: loadMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
