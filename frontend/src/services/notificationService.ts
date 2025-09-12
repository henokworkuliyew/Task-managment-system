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

  getUnreadCount: async (): Promise<{ count: number }> => {
    console.log('NotificationService: Fetching unread count');
    const response = await api.get('/notifications/unread/count');
    const data = response.data;
    console.log('NotificationService: Unread count raw response:', data);
    
    if (typeof data === 'number') {
      console.log('NotificationService: Returning direct number:', data);
      return { count: data };
    }
    if (data && data.data && typeof data.data.count === 'number') {
      console.log('NotificationService: Returning nested count:', data.data.count);
      return data.data;
    }
    if (data && typeof data.count === 'number') {
      console.log('NotificationService: Returning object count:', data.count);
      return data;
    }
    console.log('NotificationService: Defaulting to count 0');
    return { count: 0 };
  },

  markAsRead: async (notificationId: string) => {
    console.log('NotificationService: Marking as read:', notificationId);
    const response = await api.patch(`/notifications/${notificationId}/read`);
    console.log('NotificationService: Mark as read response:', response.data);
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