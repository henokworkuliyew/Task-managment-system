import { AxiosInstance, AxiosRequestConfig } from 'axios';
import authService from '../services/authService';

/**
 * Configure axios interceptors for handling authentication, token refresh, and errors
 * @param api - Axios instance to configure
 */
export const setupInterceptors = (api: AxiosInstance): void => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
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
        originalRequest._retry = true;
        
        try {
          let refreshToken = localStorage.getItem('refreshToken');
          
          // if (!refreshToken) {
          //   // No refresh token available, logout and redirect to login
          //   logoutAction();
          //   return Promise.reject(error);
          // }
          
          refreshToken = refreshToken.trim();
          
          console.log('Attempting to refresh token');
          
          const tokenResponse = await authService.refreshToken(refreshToken);
          
          const { accessToken, refreshToken: newRefreshToken } = tokenResponse;
          
          console.log('Token refreshed successfully');
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`
          };
          
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // If refresh token is invalid, logout and redirect to login
          // logoutAction();
          // return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};