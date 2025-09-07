import api from './api';
import { Task } from '../types';

export interface CreateTaskData {
  title: string;
  description: string;
  projectId: string;
  assignedTo?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'review' | 'done';
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string;
}

const taskService = {
  
  getAllTasks: async () => {
    const response = await api.get<{success: boolean, data: Task[], timestamp: string}>('/tasks');
    return response.data.data;
  },

  
  getTaskById: async (id: string) => {
    const response = await api.get<{success: boolean, data: Task, timestamp: string}>(`/tasks/${id}`);
    return response.data.data;
  },

  
  createTask: async (taskData: CreateTaskData) => {
    const response = await api.post<{success: boolean, data: Task, timestamp: string}>('/tasks', taskData);
    return response.data.data;
  },

  
  updateTask: async ({ id, ...taskData }: UpdateTaskData) => {
    const response = await api.put<{success: boolean, data: Task, timestamp: string}>(`/tasks/${id}`, taskData);
    return response.data.data;
  },

  
  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  
  getTasksByProject: async (projectId: string) => {
    const response = await api.get<{success: boolean, data: Task[], timestamp: string}>(`/tasks/project/${projectId}`);
    return response.data.data;
  },

  
  getTasksByUser: async (userId: string) => {
    const response = await api.get<{success: boolean, data: Task[], timestamp: string}>(`/tasks/user/${userId}`);
    return response.data.data;
  },

  changeTaskStatus: async (taskId: string, status: string) => {
    const response = await api.patch(`/tasks/${taskId}/status`, { status });
    return response.data;
  },

  
  assignTaskToUser: async (taskId: string, userId: string) => {
    const response = await api.patch(`/tasks/${taskId}/assign`, { userId });
    return response.data;
  },
};

export default taskService;