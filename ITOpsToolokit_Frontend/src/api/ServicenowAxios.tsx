import axios from 'axios';

// Create a separate axios instance for ServiceNow API calls
// This bypasses the main app's authentication interceptors that cause logout issues
const serviceNowAxios = axios.create({
  baseURL: 'https://cisicmpengineering1.service-now.com',
  timeout: 30000,
  auth: {
    username: 'ServicenowAPI',
    password: 'Qwerty@123'
  }
});

// Add request interceptor for ServiceNow auth
serviceNowAxios.interceptors.request.use(
  (config) => {
    // ServiceNow uses basic auth, not bearer tokens
    // The auth is already set in the instance, but we can log for debugging
    console.log('ServiceNow API request:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor that doesn't trigger app logout
serviceNowAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log ServiceNow errors but don't trigger app logout
    console.error('ServiceNow API error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default serviceNowAxios; 