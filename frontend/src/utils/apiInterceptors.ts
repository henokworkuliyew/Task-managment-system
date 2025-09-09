import authService from '../services/authService';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};


const getStoredToken = (tokenType: 'accessToken' | 'refreshToken'): string | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem(tokenType);
  
  // Check if token is valid (not null, undefined, or string representations of these)
  if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
    return null;
  }
  
  return token.trim();
};

/**
 * Configure axios interceptors for handling authentication, token refresh, and errors
 * @param api - Axios instance to configure
 */
export const setupInterceptors = (api: AxiosInstance): void => {
  api.interceptors.request.use(
    (config) => {
      const token = getStoredToken('accessToken');
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
            // No valid refresh token available, clear everything
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            processQueue(error, null);
            isRefreshing = false;
            
            // Dispatch logout action to clear Redux state
            if (typeof window !== 'undefined' && (window as typeof window & { __REDUX_STORE__: { dispatch: (action: { type: string }) => void } }).__REDUX_STORE__) {
              (window as typeof window & { __REDUX_STORE__: { dispatch: (action: { type: string }) => void } }).__REDUX_STORE__.dispatch({ type: 'auth/logout/fulfilled' });
            }
            
            return Promise.reject(error);
          }
          
          const tokenResponse = await authService.refreshToken(refreshToken);
          const { accessToken, refreshToken: newRefreshToken } = tokenResponse;
          
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
          // Clear tokens and Redux state
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          processQueue(refreshError, null);
          isRefreshing = false;
          
          // Dispatch logout action to clear Redux state
          if (typeof window !== 'undefined' && (window as typeof window & { __REDUX_STORE__: { dispatch: (action: { type: string }) => void } }).__REDUX_STORE__) {
            (window as typeof window & { __REDUX_STORE__: { dispatch: (action: { type: string }) => void } }).__REDUX_STORE__.dispatch({ type: 'auth/logout/fulfilled' });
          }
          
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};