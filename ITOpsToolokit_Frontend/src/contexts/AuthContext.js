import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
// import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Configure axios interceptor for auth token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token validity
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userDataString = localStorage.getItem('userData');
      const serviceNowAuthString = localStorage.getItem('serviceNowAuth');
      
      if (token === 'servicenow-authenticated' && userDataString && serviceNowAuthString) {
        // Restore user data from localStorage
        const userData = JSON.parse(userDataString);
        const serviceNowAuth = JSON.parse(serviceNowAuthString);
        
        // Optionally verify the credentials are still valid by making a test API call
        // For now, we'll trust the stored credentials
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Clear invalid tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('serviceNowAuth');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Token verification failed, remove it
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('serviceNowAuth');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userId, password) => {
    try {
      setLoading(true);
      
      // Create options with basic auth for ServiceNow
      const options = {
        auth: {
          username: userId,
          password: password,
        },
      };

      // ServiceNow API endpoint for authentication verification
      const link = 'https://cisicmpengineering1.service-now.com/api/now/table/incident?sysparm_query=sys_created_onBETWEENjavascript:gs.dateGenerate(\'1970-01-01\',\'00:00:00\')@javascript:gs.dateGenerate(\'1970-01-01\',\'00:00:01\')';
      
      // Import Api here to avoid circular dependency
      const { Api } = await import('../../src/features/Utilities/api');
      
      // Attempt authentication with ServiceNow
      const response = await Api.serviceNowAuth(link, options);

      // If we get here, authentication was successful (status 200)
      if (response.status === 200) {
        // Create mock user data based on successful authentication
        const userData = {
          user_id: userId,
          name: userId, // You can customize this based on your needs
          role: 'User'
        };

        // Store user credentials for future ServiceNow API calls
        localStorage.setItem('serviceNowAuth', JSON.stringify({ username: userId, password: password }));
        localStorage.setItem('authToken', 'servicenow-authenticated'); // Mock token for app state
        localStorage.setItem('userData', JSON.stringify(userData));

        // Update state
        setUser(userData);
        setIsAuthenticated(true);

        // toast.success(`Welcome back, ${userData.name}!`);
        return { success: true };
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      // Handle different error scenarios
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Incorrect user ID or password. Please try again.';
        } else if (error.response.status === 403) {
          errorMessage = 'Access denied. Please check your credentials.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.response?.data?.error?.message || 'Authentication failed.';
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      console.error('Login error:', error);
    //   toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('serviceNowAuth');
    setUser(null);
    setIsAuthenticated(false);
    // toast.success('Logged out successfully');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 