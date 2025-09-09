import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services';
import { AuthState, User } from '../../types';
import type { AppDispatch } from '../store';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

/**
 * Helper function to safely get tokens from localStorage
 * Filters out invalid values like "undefined", "null", empty strings
 */
const getStoredToken = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem(key);
  if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
    return null;
  }
  return token.trim();
};

/**
 * Helper function to safely store tokens in localStorage
 * Only stores valid tokens, clears invalid ones
 */
const storeToken = (key: string, token: string | null | undefined): void => {
  if (typeof window === 'undefined') return;
  
  console.log(`storeToken(${key}):`, token ? `STORING_TOKEN_LENGTH_${token.length}` : 'REMOVING_TOKEN');
  if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, token.trim());
    console.log(`Token stored in localStorage for ${key}`);
  }
};

// Initialize state from localStorage
const initializeAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  }

  const accessToken = getStoredToken('accessToken');
  const refreshToken = getStoredToken('refreshToken');
  const storedUser = localStorage.getItem('user');
  
  let user = null;
  try {
    if (storedUser && storedUser !== 'null' && storedUser !== 'undefined') {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('Error parsing stored user:', error);
    localStorage.removeItem('user');
  }

  const isAuthenticated = !!(accessToken && refreshToken && user);

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = initializeAuthState();

export const register = createAsyncThunk<{ message: string; email: string; name: string }, { name: string; email: string; password: string }>(
  'auth/register',
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const login = createAsyncThunk<{ user: User; accessToken: string; refreshToken: string }, { email: string; password: string }>(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      console.log('Login API response received - RAW:', response);
      console.log('Login API response received - ANALYSIS:', {
        hasUser: !!response.user,
        hasAccessToken: !!response.accessToken,
        hasRefreshToken: !!response.refreshToken,
        accessTokenLength: response.accessToken?.length,
        refreshTokenLength: response.refreshToken?.length,
        responseKeys: Object.keys(response || {}),
        accessTokenValue: response.accessToken,
        refreshTokenValue: response.refreshToken
      });
      
      console.log('Storing tokens in localStorage...');
      storeToken('accessToken', response.accessToken);
      storeToken('refreshToken', response.refreshToken);
      
      // Verify tokens were stored
      const storedAccess = localStorage.getItem('accessToken');
      const storedRefresh = localStorage.getItem('refreshToken');
      console.log('Verification after storage:', {
        storedAccessToken: storedAccess ? `LENGTH_${storedAccess.length}` : 'NULL',
        storedRefreshToken: storedRefresh ? `LENGTH_${storedRefresh.length}` : 'NULL'
      });
      
      return response;
    } catch (error: unknown) {
      console.error('Login failed:', error);
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Login failed');
    }
  }
);
//

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword({ email });
      return response;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Failed to send reset email');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(data);
      return response;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const updateSettings = createAsyncThunk(
  'auth/updateSettings',
  async (data: { settings: Record<string, unknown> }, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile({ settings: data.settings });
      return response;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Failed to update settings');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { token: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword({ token: data.token, newPassword: data.password });
      return response;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Failed to reset password');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (data: { email: string; otp: string; type?: string }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(data);
      return response;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Failed to verify OTP');
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(token);
      return response;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Failed to verify email');
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerificationEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.resendVerificationEmail(email);
      return response;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Failed to resend verification email');
    }
  }
);

export const getCurrentUser = createAsyncThunk<User, void>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Failed to get user');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const storedRefreshToken = getStoredToken('refreshToken');
      
      if (!storedRefreshToken) {
        throw new Error('No valid refresh token available');
      }
      
      const response = await authService.refreshToken(storedRefreshToken);
      storeToken('accessToken', response.accessToken);
      storeToken('refreshToken', response.refreshToken);
      
      return response;
    } catch (error: unknown) {
      // Clear invalid tokens
      storeToken('accessToken', null);
      storeToken('refreshToken', null);
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Token refresh failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout();
  } catch (error) {
    // Even if the API call fails, we still want to clear local storage
    console.error('Logout API call failed:', error);
  }
  storeToken('accessToken', null);
  storeToken('refreshToken', null);
  return null;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuthState: (state, action: PayloadAction<{
      user: User;
      accessToken: string;
      refreshToken: string;
      isAuthenticated: boolean;
    }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<{ message: string; email: string; name: string }>) => {
      state.isLoading = false;
      // Don't set user or authentication state - user needs to verify OTP first
      state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      
      // Store user data in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get Current User
    builder.addCase(getCurrentUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      
      // Store user data in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    });
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      
      // Clear user data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    });

    // Forgot Password
    builder.addCase(forgotPassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Reset Password
    builder.addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Update Settings
    builder.addCase(updateSettings.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateSettings.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      
      // Store updated user data in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    });
    builder.addCase(updateSettings.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Verify OTP
    builder.addCase(verifyOtp.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyOtp.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const initializeAuth = () => (dispatch: AppDispatch) => {
  if (typeof window !== 'undefined') {
    const accessToken = getStoredToken('accessToken');
    const refreshToken = getStoredToken('refreshToken');
    const storedUser = localStorage.getItem('user');
    
    if (accessToken && refreshToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch(authSlice.actions.setAuthState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true
        }));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }
};

export const { clearError, setAuthState } = authSlice.actions;
export default authSlice.reducer;