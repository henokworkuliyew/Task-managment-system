import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface RefreshTokenData {
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    bio?: string;
    skills?: string[];
    availability?: Record<string, any>;
    isActive: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

const authService = {

  login: async (credentials: LoginCredentials) => {
    const response = await api.post<{success: boolean, data: AuthResponse, timestamp: string}>('/auth/login', credentials);
    return response.data.data; // Extract the actual auth data from the wrapped response
  },


  register: async (userData: RegisterData) => {
    const response = await api.post<{success: boolean, data: AuthResponse, timestamp: string}>('/auth/register', userData);
    return response.data.data; // Extract the actual auth data from the wrapped response
  },

  
  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  
  resetPassword: async (data: ResetPasswordData) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  
  verifyOtp: async (data: VerifyOtpData) => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  
  refreshToken: async (refreshToken: string) => {
    const response = await api.post<{
      success: boolean;
      data: {
        accessToken: string;
        refreshToken: string;
      };
      timestamp: string;
    }>('/auth/refresh', { refreshToken })
    return response.data.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  
  updateProfile: async (data: Partial<any>) => {
    const response = await api.patch('/auth/profile', data);
    return response.data;
  },
};

export default authService;