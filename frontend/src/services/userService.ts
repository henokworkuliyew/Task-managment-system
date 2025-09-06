import api from './api';
import { User } from '../types';

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const userService = {
  
  getAllUsers: async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  
  updateProfile: async (userData: UpdateUserData) => {
    const response = await api.put<User>('/users/profile', userData);
    return response.data;
  },

  changePassword: async (passwordData: ChangePasswordData) => {
    const response = await api.post('/users/change-password', passwordData);
    return response.data;
  },

  
  uploadAvatar: async (formData: FormData) => {
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getUsersByProject: async (projectId: string) => {
    const response = await api.get<User[]>(`/users/project/${projectId}`);
    return response.data;
  },
};

export default userService;