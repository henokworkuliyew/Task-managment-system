import { Issue } from '@/types';
import api from './api';

export interface CreateIssueData {
  title: string;
  description: string;
  projectId: string;
  taskId?: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  severity: 'minor' | 'major' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

export interface UpdateIssueData extends Partial<CreateIssueData> {
  id: string;
}

const issueService = {
  
  getAllIssues: async () => {
    const response = await api.get<Issue[]>('/issues');
    return response.data;
  },

  
  getIssueById: async (id: string) => {
    const response = await api.get<Issue>(`/issues/${id}`);
    return response.data;
  },

  
  createIssue: async (issueData: CreateIssueData) => {
    const response = await api.post<Issue>('/issues', issueData);
    return response.data;
  },

  
  updateIssue: async ({ id, ...issueData }: UpdateIssueData) => {
    const response = await api.put<Issue>(`/issues/${id}`, issueData);
    return response.data;
  },

  
  deleteIssue: async (id: string) => {
    const response = await api.delete(`/issues/${id}`);
    return response.data;
  },

  
  getIssuesByProject: async (projectId: string) => {
    const response = await api.get<Issue[]>(`/issues/project/${projectId}`);
    return response.data;
  },

  getIssuesByTask: async (taskId: string) => {
    const response = await api.get<Issue[]>(`/issues/task/${taskId}`);
    return response.data;
  },

  getIssuesByUser: async (userId: string) => {
    const response = await api.get<Issue[]>(`/issues/user/${userId}`);
    return response.data;
  },

  changeIssueStatus: async (issueId: string, status: string) => {
    const response = await api.patch(`/issues/${issueId}/status`, { status });
    return response.data;
  },

  assignIssueToUser: async (issueId: string, userId: string) => {
    const response = await api.patch(`/issues/${issueId}/assign`, { userId });
    return response.data;
  },
};

export default issueService;