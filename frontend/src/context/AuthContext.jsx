import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, demoLogin, getMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('taskpulse_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('taskpulse_token') || null;
  });

  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  // Persist session
  useEffect(() => {
    if (token) {
      localStorage.setItem('taskpulse_token', token);
    } else {
      localStorage.removeItem('taskpulse_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('taskpulse_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('taskpulse_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        setAuthModalOpen(false);
        return { success: true, user: res.user, message: res.message };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await registerUser(userData);
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        setAuthModalOpen(false);
        return { success: true, user: res.user, message: res.message };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const res = await demoLogin();
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        setAuthModalOpen(false);
        return { success: true, user: res.user, message: res.message };
      }
      return { success: false, message: 'Demo login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Demo login error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('taskpulse_token');
    localStorage.removeItem('taskpulse_user');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        loading,
        login,
        register,
        handleDemoLogin,
        logout,
        authModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

