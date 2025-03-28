import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  register: () => {},
  logout: () => {},
  updateProfile: () => {}
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      
      try {
        // Try to get the current user from your API
        // This is just a placeholder. Implement actual API call.
        const token = localStorage.getItem('token');
        
        if (token) {
          // For development/testing - simulate a successful auth check
          // Replace with actual API call in production
          // const response = await axios.get('/api/me', {
          //   headers: { Authorization: `Bearer ${token}` }
          // });
          
          // Mock user data - replace with actual API response
          setUser({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin'
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      // This is a placeholder. Implement actual API call.
      // const response = await axios.post('/api/login', { email, password });
      // const { token, user } = response.data;
      
      // Mock successful login - replace with actual API call
      // This simulates storing a JWT token
      localStorage.setItem('token', 'mock-jwt-token');
      
      // Mock user data - replace with actual user data from API
      const userData = {
        id: '1',
        name: 'John Doe',
        email,
        role: 'admin'
      };
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (name, email, password) => {
    setIsLoading(true);
    
    try {
      // This is a placeholder. Implement actual API call.
      // const response = await axios.post('/api/register', { 
      //   name, email, password 
      // });
      
      // For now, simulate successful registration
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  // Update profile function
  const updateProfile = async (data) => {
    setIsLoading(true);
    
    try {
      // This is a placeholder. Implement actual API call.
      // const response = await axios.put('/api/users/me', data, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      
      // For now, simulate successful profile update
      setUser(prev => ({ ...prev, ...data }));
      return { success: true };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
