import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthService } from '../services/authService';
import { setOnUnauthorized } from '../apiClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadMe = useCallback(async () => {
    setLoading(true);
    try {
        const user = await AuthService.me();
      setUser(user);
    } catch (e) {
      if (e.message === 'Unauthorized' || e.message === 'HTTP 401') {
        setUser(null);
      } else if (e.message.startsWith('HTTP 5')) {
        console.error('me error:', e);
        setUser(null);
      } else {
        setUser(null);
      }
    }
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
    const res = await AuthService.login(credentials);
    if (res.success) {
      // server sets cookie; refresh user (cookie async yazılır)
      setTimeout(() => { loadMe(); }, 150);
    }
    return res;
  };

  const register = async (credentials) => {
    const res = await AuthService.register(credentials);
    if (res.success) {
      setTimeout(() => { loadMe(); }, 150);
    }
    return res;
  };

  const logout = async () => {
     const res = await AuthService.logout();
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
