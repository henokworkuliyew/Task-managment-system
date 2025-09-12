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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Redux fetchUnreadCount: Starting API call');
      const response = await notificationService.getUnreadCount();
      console.log('Redux fetchUnreadCount: API response:', response);
      // Handle different response structures and ensure we always return a number
      if (typeof response === 'object' && response !== null && 'count' in response) {
        return typeof response.count === 'number' ? response.count : 0;
      }
      return 0;
    } catch (error: unknown) {
      console.error('Redux fetchUnreadCount: Error occurred:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch unread count';
      return rejectWithValue(errorMessage);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('Redux markAsRead: Starting for notification ID:', id);
      const result = await notificationService.markAsRead(id);
      console.log('Redux markAsRead: Service call successful:', result);
      return id;
    } catch (error: unknown) {
      console.error('Redux markAsRead: Error occurred:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as read';
      return rejectWithValue(errorMessage);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark all notifications as read';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete notification';
      return rejectWithValue(errorMessage);
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
      console.log('Redux fetchUnreadCount.fulfilled: Previous unread count:', state.unreadCount);
      console.log('Redux fetchUnreadCount.fulfilled: New unread count:', action.payload);
      state.unreadCount = action.payload;
      console.log('Redux fetchUnreadCount.fulfilled: State updated to:', state.unreadCount);
    });
    builder.addCase(fetchUnreadCount.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Mark As Read
    builder.addCase(markAsRead.pending, (state) => {
      state.error = null;
    });
    builder.addCase(markAsRead.fulfilled, (state, action: PayloadAction<string>) => {
      console.log('Redux markAsRead.fulfilled: Notification ID:', action.payload);
      console.log('Redux markAsRead.fulfilled: Current unread count:', state.unreadCount);
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        console.log('Redux markAsRead.fulfilled: Found notification, current read status:', notification.read);
        if (!notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
          console.log('Redux markAsRead.fulfilled: Updated unread count to:', state.unreadCount);
        } else {
          console.log('Redux markAsRead.fulfilled: Notification was already read');
        }
      } else {
        console.log('Redux markAsRead.fulfilled: Notification not found in state');
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