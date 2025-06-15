import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '../services/api';

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
      const storedToken = localStorage.getItem('adminToken');
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
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
      // Call the login API
      const response = await userApi.login({
        email: usernameOrEmail,
        password: password
      });

      console.log('Login response:', response);

      // Handle both possible response formats
      let userData, token;
      
      // Format 1: {status: true, message: 'Login successful', data: {user, token}}
      if (response.status === true && response.data) {
        userData = response.data.user;
        token = response.data.token;
      }
      // Format 2: {message: 'Login successful', token, user}
      else if (response.message === 'Login successful' && response.token && response.user) {
        userData = response.user;
        token = response.token;
      }
      
      if (userData && token) {
        // Remove password if present and create clean user object
        const userWithoutPassword = { ...userData };
        delete userWithoutPassword.password;
        
        // Store user data and token
        setUser(userWithoutPassword);
        localStorage.setItem('adminUser', JSON.stringify(userWithoutPassword));
        localStorage.setItem('adminToken', token);
        
        setLoading(false);
        return { success: true };
      }
      
      // Handle error responses
      if (response.status === false || (response.message && response.message !== 'Login successful')) {
        setLoading(false);
        return { 
          success: false, 
          error: response.message || 'Login failed' 
        };
      }

      // If we get here, the response format is unexpected
      console.error('Unexpected response format:', response);
      setLoading(false);
      return { 
        success: false, 
        error: 'Invalid response format from server. Please try again.' 
      };
      
    } catch (error) {
      console.error('Authentication failed:', error.message);
      setLoading(false);
      
      // Provide user-friendly error messages
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (error.message.includes('Unable to connect')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'Invalid credentials. Please check your email and password.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('Invalid credentials')) {
        errorMessage = 'Invalid credentials. Please check your email and password.';
      } else if (error.message.includes('Account is inactive')) {
        errorMessage = 'Account is inactive. Please contact administrator.';
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (userData) => {
    setError(null);
    setLoading(true);

    try {
      const response = await userApi.register(userData);

      console.log('Register response:', response);

      // Handle standardized response format: { status: true, data: userData }
      if (response.status === true && response.data) {
        const userWithoutPassword = { ...response.data };
        delete userWithoutPassword.password;
        
        setUser(userWithoutPassword);
        localStorage.setItem('adminUser', JSON.stringify(userWithoutPassword));
        
        setLoading(false);
        return { success: true };
      }
      
      // Handle error responses
      if (response.status === false) {
        setLoading(false);
        return { 
          success: false, 
          error: response.message || 'Registration failed' 
        };
      }

      setLoading(false);
      return { 
        success: false, 
        error: 'Invalid response format from server. Please try again.' 
      };
      
    } catch (error) {
      console.error('Registration failed:', error.message);
      setLoading(false);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message.includes('Unable to connect')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.message.includes('409') || error.message.includes('Email already exists')) {
        errorMessage = 'User already exists with this email.';
      } else if (error.message.includes('Username already exists')) {
        errorMessage = 'Username already taken. Please choose a different username.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Invalid data provided. Please check your input.';
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    clearError,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};