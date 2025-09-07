// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  availability?: Record<string, any>;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  priority: 'low' | 'medium' | 'high';
  tags: string[] | null;
  progress: number;
  isActive: boolean;
  owner: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

// Task Types
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  progress: number;
  dueDate: string | null;
  startDate: string | null;
  completedDate: string | null;
  estimatedHours: number | null;
  assignee: User | null;
  project: Project;
  parentTask: Task | null;
  subtasks: Task[];
  dependencies: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

// Issue Types
export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type IssuePriority = 'critical' | 'high' | 'medium' | 'low';
export type IssueType = 'bug' | 'feature' | 'improvement' | 'task';

export interface Issue {
  id: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  createdAt: string;
  updatedAt: string;
  reportedBy: User;
  assignedTo: User | null;
  projectId: string;
}

export interface IssueState {
  issues: Issue[];
  currentIssue: Issue | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  data: any;
  createdAt: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  projects: ProjectState;
  tasks: TaskState;
  issues: IssueState;
  notifications: NotificationState;
}