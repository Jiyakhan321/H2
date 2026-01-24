import apiClient from './api_client';

class AuthService {
  constructor() {
    this.tokenKey = 'access_token';
    this.userKey = 'user';
  }

  // Store token and user data
  setTokenAndUser(token, user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  // Get token
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // Get user data
  getUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(this.userKey);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  }

  // Register a new user
  async register(email, password, firstName, lastName) {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });

      const { access_token, user } = response.data;

      // Store token and user data
      this.setTokenAndUser(access_token, user);

      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed'
      };
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });

      const { access_token, user } = response.data;

      // Store token and user data
      this.setTokenAndUser(access_token, user);

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Invalid credentials'
      };
    }
  }

  // Logout user
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  // Refresh token (if refresh token mechanism is implemented)
  async refreshToken() {
    // In a typical implementation, you'd use a refresh token to get a new access token
    // This is a simplified version - in a real app, you'd have a refresh endpoint
    const token = this.getToken();
    if (!token) {
      return null;
    }

    // Check if token is about to expire (within 5 minutes)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - currentTime;

      if (timeUntilExpiry < 5 * 60) { // 5 minutes in seconds
        // Token is expiring soon, would need to refresh
        // This would require a refresh token implementation
        return null;
      }

      return token;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return null;
    }
  }

  // Verify JWT token
  async verifyToken(token) {
    try {
      const response = await apiClient.post('/auth/verify', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.valid) {
        return response.data.user;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Get current user info
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  }

  // Logout user
  async logout() {
    try {
      await apiClient.post('/auth/logout');
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
      }
      return { success: true };
    } catch (error) {
      // Even if API logout fails, clear local tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
      }
      return { success: true };
    }
  }
}

export default new AuthService();