import api from './api';
import { Project } from '@/types';

export interface CreateProjectData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: string;
}

const projectService = {
  
  getAllProjects: async (params: Record<string, string> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get<{success: boolean, data: {data: Project[], total: number, page: number, limit: number, totalPages: number}, timestamp: string}>(`/projects${queryString ? `?${queryString}` : ''}`);
    return response.data.data;
  },

  
  getProjectById: async (id: string) => {
    const response = await api.get<{success: boolean, data: Project, timestamp: string}>(`/projects/${id}`);
    return response.data.data;
  },

  
  createProject: async (projectData: CreateProjectData) => {
    const response = await api.post<{success: boolean, data: Project, timestamp: string}>('/projects', projectData);
    return response.data.data;
  },

  
  updateProject: async ({ id, ...projectData }: UpdateProjectData) => {
    const response = await api.put<{success: boolean, data: Project, timestamp: string}>(`/projects/${id}`, projectData);
    return response.data.data;
  },

  
  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  
  getProjectsByUser: async (userId: string) => {
    const response = await api.get<{success: boolean, data: Project[], timestamp: string}>(`/projects/user/${userId}`);
    return response.data.data;
  },

  
  getProjectMembers: async (projectId: string, params: Record<string, string | number> = {}): Promise<{ data: { id: string, userId: string, projectId: string, role: string }[], success: boolean, timestamp: string }> => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const response = await api.get<{ data: { id: string, userId: string, projectId: string, role: string }[], success: boolean, timestamp: string }>(`/projects/${projectId}/users${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  addUserToProject: async (projectId: string, userId: string, role: string) => {
    const response = await api.post(`/projects/${projectId}/users`, { userId, role });
    return response.data;
  },

  removeUserFromProject: async (projectId: string, userId: string) => {
    const response = await api.delete(`/projects/${projectId}/users/${userId}`);
    return response.data;
  },
};

export default projectService;