import api from '../services/api';
import authService from '../services/authService';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Helper function to safely get tokens from localStorage
 * Filters out invalid values like "undefined", "null", empty strings
 */
const getStoredToken = (tokenType: 'accessToken' | 'refreshToken'): string | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem(tokenType);
  
  // Check if token is valid (not null, undefined, or string representations of these)
  if (!token || token === 'null' || token === 'undefined') {
    return null;
  }
  
  return token;
};

/**
 * Configure axios interceptors for handling authentication, token refresh, and errors
 * @param api - Axios instance to configure
 */
export const setupInterceptors = (api: AxiosInstance): void => {
  api.interceptors.request.use(
    (config) => {
      const token = getStoredToken('accessToken');
      console.log('API Interceptor - Token from storage:', token ? 'TOKEN_FOUND' : 'TOKEN_MISSING');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('API Interceptor - Authorization header set');
      } else {
        console.log('API Interceptor - No token available, skipping Authorization header');
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`
            };
            return api(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;
        
        try {
          const refreshToken = getStoredToken('refreshToken');
          
          if (!refreshToken) {
            // No valid refresh token available, logout and redirect to login
            console.error('No valid refresh token available');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            processQueue(error, null);
            isRefreshing = false;
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
            return Promise.reject(error);
          }
          
          console.log('Attempting to refresh token');
          
          const tokenResponse = await authService.refreshToken(refreshToken);
          
          const { accessToken, refreshToken: newRefreshToken } = tokenResponse;
          
          console.log('Token refreshed successfully');
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          processQueue(null, accessToken);
          isRefreshing = false;
          
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`
          };
          
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Clear tokens and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          processQueue(refreshError, null);
          isRefreshing = false;
          
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};