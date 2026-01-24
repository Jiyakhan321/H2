'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth_service';

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

  useEffect(() => {
    console.log('AuthContext: Initializing authentication state'); // Debug log
    const initAuth = async () => {
      // Check if user is logged in on initial load
      const token = localStorage.getItem('access_token');
      console.log('AuthContext: Token found:', !!token); // Debug log

      if (token) {
        // Check if token is expired by decoding the JWT payload
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(base64));
          const currentTime = Math.floor(Date.now() / 1000);

          console.log('AuthContext: Token exp:', payload.exp, 'Current time:', currentTime); // Debug log

          // If token is expired, remove it
          if (payload.exp && payload.exp < currentTime) {
            console.log('AuthContext: Token is expired, removing'); // Debug log
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
          } else {
            console.log('AuthContext: Token is valid, retrieving user data'); // Debug log
            // Token is valid, get user data
            const userData = localStorage.getItem('user');
            if (userData) {
              try {
                const parsedUser = JSON.parse(userData);
                console.log('AuthContext: Setting user:', parsedUser); // Debug log
                setUser(parsedUser);
              } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
              }
            } else {
              console.log('AuthContext: No user data found despite having token'); // Debug log
            }
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        }
      } else {
        console.log('AuthContext: No token found'); // Debug log
      }
      console.log('AuthContext: Setting loading to false'); // Debug log
      setLoading(false);
    };

    // Use a small delay to ensure DOM is ready
    const timer = setTimeout(initAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Starting login process'); // Debug log
      const response = await authService.login(email, password);
      console.log('AuthContext: Login response:', response); // Debug log

      if (response.success) {
        // The authService.login already stores the token and user data
        const userData = localStorage.getItem('user');
        console.log('AuthContext: Retrieved user data after login:', !!userData); // Debug log

        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('AuthContext: Setting user after login:', parsedUser); // Debug log
          setUser(parsedUser); // Update local state to reflect logged-in user
        }
        return { success: true, user: userData ? JSON.parse(userData) : null };
      } else {
        console.log('AuthContext: Login failed with error:', response.error); // Debug log
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error); // Debug log
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (email, password, firstName, lastName) => {
    try {
      console.log('AuthContext: Starting registration process'); // Debug log
      const response = await authService.register(email, password, firstName, lastName);
      console.log('AuthContext: Registration response:', response); // Debug log

      if (response.success) {
        // The authService.register already stores the token and user data
        const userData = localStorage.getItem('user');
        console.log('AuthContext: Retrieved user data after registration:', !!userData); // Debug log

        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('AuthContext: Setting user after registration:', parsedUser); // Debug log
          setUser(parsedUser); // Update local state to reflect logged-in user
        }
        return { success: true, user: userData ? JSON.parse(userData) : null };
      } else {
        console.log('AuthContext: Registration failed with error:', response.error); // Debug log
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('AuthContext: Registration error:', error); // Debug log
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    await authService.logout(); // Call the API logout and clear local storage
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!localStorage.getItem('access_token')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};