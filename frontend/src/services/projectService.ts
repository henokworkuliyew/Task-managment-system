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
  
  getAllProjects: async () => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  
  getProjectById: async (id: string) => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  
  createProject: async (projectData: CreateProjectData) => {
    const response = await api.post<Project>('/projects', projectData);
    return response.data;
  },

  
  updateProject: async ({ id, ...projectData }: UpdateProjectData) => {
    const response = await api.put<Project>(`/projects/${id}`, projectData);
    return response.data;
  },

  
  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  
  getProjectsByUser: async (userId: string) => {
    const response = await api.get<Project[]>(`/projects/user/${userId}`);
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