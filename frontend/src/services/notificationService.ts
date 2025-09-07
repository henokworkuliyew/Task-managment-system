import { Notification } from '@/types';
import api from './api';

const notificationService = {
 
  getUserNotifications: async () => {
    const response = await api.get<{success: boolean, data: Notification[], timestamp: string}>('/notifications');
    return response.data.data;
  },

  getUnreadCount: async () => {
    const response = await api.get<{success: boolean, data: { count: number }, timestamp: string}>('/notifications/unread/count');
    return response.data.data;
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