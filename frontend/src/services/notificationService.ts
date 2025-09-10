import api from './api';
import { Notification } from '@/types';

const notificationService = {
 
  getUserNotifications: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    const data = response.data;
    
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data.data;
    }
    if (data && typeof data === 'object' && 'data' in data && data.data && typeof data.data === 'object' && 'data' in data.data && Array.isArray(data.data.data)) {
      return data.data.data;
    }
    
    return [];
  },

  getUnreadCount: async () => {
    const response = await api.get<{success: boolean, data: { count: number }, timestamp: string}>('/notifications/unread/count');
    const data = response.data;
    if (typeof data === 'number') {
      return { count: data };
    }
    if (data && data.data && typeof data.data.count === 'number') {
      return data.data;
    }
    return { count: 0 };
  },

  markAsRead: async (notificationId: string) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

 
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  deleteAllNotifications: async () => {
    const response = await api.delete('/notifications');
    return response.data;
  },
};

export default notificationService;