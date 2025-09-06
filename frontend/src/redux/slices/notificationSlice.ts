import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { notificationService } from '../../services';
import { NotificationState, Notification } from '../../types';

interface NotificationQueryParams {
  page?: number;
  limit?: number;
  read?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  unreadCount: 0,
};

export const fetchNotifications = createAsyncThunk<{ data: Notification[]; total: number; page: number; limit: number; totalPages: number }, NotificationQueryParams>(
  'notifications/fetchNotifications',
  async (params: NotificationQueryParams = {}, { rejectWithValue }) => {
    try {
      const notifications = await notificationService.getUserNotifications();
      return {
        data: notifications,
        total: notifications.length,
        page: params.page || 1,
        limit: params.limit || notifications.length,
        totalPages: Math.ceil(notifications.length / (params.limit || notifications.length))
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const count = await notificationService.getUnreadCount();
      return count;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications = [action.payload, ...state.notifications];
      state.totalCount += 1;
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Notifications
    builder.addCase(fetchNotifications.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<{ data: Notification[]; total: number; page: number; limit: number; totalPages: number }>) => {
      state.isLoading = false;
      state.notifications = action.payload.data;
      state.totalCount = action.payload.total;
    });
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Unread Count
    builder.addCase(fetchUnreadCount.pending, (state) => {
      state.error = null;
    });
    builder.addCase(fetchUnreadCount.fulfilled, (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    });
    builder.addCase(fetchUnreadCount.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Mark As Read
    builder.addCase(markAsRead.pending, (state) => {
      state.error = null;
    });
    builder.addCase(markAsRead.fulfilled, (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });
    builder.addCase(markAsRead.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Mark All As Read
    builder.addCase(markAllAsRead.pending, (state) => {
      state.error = null;
    });
    builder.addCase(markAllAsRead.fulfilled, (state) => {
      state.notifications = state.notifications.map(notification => ({
        ...notification,
        read: true
      }));
      state.unreadCount = 0;
    });
    builder.addCase(markAllAsRead.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Delete Notification
    builder.addCase(deleteNotification.pending, (state) => {
      state.error = null;
    });
    builder.addCase(deleteNotification.fulfilled, (state, action: PayloadAction<string>) => {
      const deletedNotification = state.notifications.find(n => n.id === action.payload);
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
      state.totalCount -= 1;
      if (deletedNotification && !deletedNotification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });
    builder.addCase(deleteNotification.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { clearNotificationError, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;