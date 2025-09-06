import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
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
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

const authService = {

  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },


  register: async (userData: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
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
      accessToken: string
      refreshToken: string
    }>('/auth/refresh', { refreshToken })
    return response.data;
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