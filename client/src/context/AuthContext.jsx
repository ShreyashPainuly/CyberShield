import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('cybershield_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authAPI.getMe();
      setUser(data.user);
    } catch {
      localStorage.removeItem('cybershield_token');
      localStorage.removeItem('cybershield_user');
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('cybershield_token', data.token);
    localStorage.setItem('cybershield_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await authAPI.register({ name, email, password });
    localStorage.setItem('cybershield_token', data.token);
    localStorage.setItem('cybershield_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const updateUser = async (updates) => {
    const { data } = await authAPI.updateProfile(updates);
    localStorage.setItem('cybershield_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cybershield_token');
    localStorage.removeItem('cybershield_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
