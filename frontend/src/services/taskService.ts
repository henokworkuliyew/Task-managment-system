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
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  
  getTaskById: async (id: string) => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  
  createTask: async (taskData: CreateTaskData) => {
    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
  },

  
  updateTask: async ({ id, ...taskData }: UpdateTaskData) => {
    const response = await api.put<Task>(`/tasks/${id}`, taskData);
    return response.data;
  },

  
  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  
  getTasksByProject: async (projectId: string) => {
    const response = await api.get<Task[]>(`/tasks/project/${projectId}`);
    return response.data;
  },

  
  getTasksByUser: async (userId: string) => {
    const response = await api.get<Task[]>(`/tasks/user/${userId}`);
    return response.data;
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