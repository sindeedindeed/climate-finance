import React, { createContext, useContext, useState, useEffect } from 'react';
import { demoCredentials } from '../data/demoCredentials';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Check if user is already logged in
      const storedUser = localStorage.getItem('adminUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem('adminUser');
      setError('Session data corrupted. Please log in again.');
    }
    setLoading(false);
  }, []);

  const login = async (usernameOrEmail, password) => {
    setError(null);
    setLoading(true);

    // Validate input
    if (!usernameOrEmail || !password) {
      setLoading(false);
      return { success: false, error: 'Username/email and password are required' };
    }

    try {
      // Use the proper API service instead of direct fetch
      const { userApi } = await import('../services/api');
      const data = await userApi.login({
        email: usernameOrEmail,
        password: password
      });

      if (data.user) {
        const userWithoutPassword = { ...data.user };
        delete userWithoutPassword.password;
        
        setUser(userWithoutPassword);
        localStorage.setItem('adminUser', JSON.stringify(userWithoutPassword));
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, error: data.message || 'Authentication failed' };
      }
    } catch (error) {
      console.warn('Backend authentication failed, trying demo credentials:', error.message);
      
      // Fallback to demo credentials for development
      const foundUser = demoCredentials.find(
        user => (user.username === usernameOrEmail || user.email === usernameOrEmail) && 
                user.password === password && user.isActive
      );

      if (foundUser) {
        const userWithoutPassword = { ...foundUser };
        delete userWithoutPassword.password;
        userWithoutPassword.lastLogin = new Date().toISOString();
        
        setUser(userWithoutPassword);
        localStorage.setItem('adminUser', JSON.stringify(userWithoutPassword));
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { 
          success: false, 
          error: 'Invalid credentials. Please check your username/email and password.' 
        };
      }
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('adminUser');
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    error,
    clearError,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};