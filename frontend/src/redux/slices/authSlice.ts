import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services';
import { AuthState, User } from '../../types';

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

const initialState: AuthState = {
  user: null,
  accessToken: getStoredToken('accessToken'),
  refreshToken: getStoredToken('refreshToken'),
  isAuthenticated: !!getStoredToken('accessToken'),
  isLoading: false,
  error: null,
};

export const register = createAsyncThunk<{ user: User; accessToken: string; refreshToken: string }, { name: string; email: string; password: string }>(
  'auth/register',
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      storeToken('accessToken', response.accessToken);
      storeToken('refreshToken', response.refreshToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
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
    } catch (error: any) {
      console.error('Login failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword({ email });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const updateSettings = createAsyncThunk(
  'auth/updateSettings',
  async (data: { settings: any }, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile({ settings: data.settings });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { email : string;token: string; password: string; confirmPassword: string }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (data: { email: string; otp: string; type?: string }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
    }
  }
);

export const getCurrentUser = createAsyncThunk<User, void>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user');
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
    } catch (error: any) {
      // Clear invalid tokens
      storeToken('accessToken', null);
      storeToken('refreshToken', null);
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
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

export const { clearError } = authSlice.actions;
export default authSlice.reducer;