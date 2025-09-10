// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  availability?: Record<string, unknown>;
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
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
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

export interface Comment {
  id: string;
  content: string;
  mentions: string[] | null;
  attachments: string[] | null;
  isEdited: boolean;
  author: User;
  authorId: string;
  project: Project | null;
  projectId: string | null;
  task: Task | null;
  taskId: string | null;
  issue: Issue | null;
  issueId: string | null;
  parentComment: Comment | null;
  parentCommentId: string | null;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface TimeLog {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  description: string | null;
  isRunning: boolean;
  user: User;
  userId: string;
  task: Task;
  taskId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  progress: number;
  deadline: string | null;
  estimatedHours: number | null;
  tags: string[] | null;
  attachments: string[] | null;
  isActive: boolean;
  assignee: User | null;
  assigneeId: string | null;
  project: Project;
  projectId: string;
  parentTask: Task | null;
  parentTaskId: string | null;
  subtasks: Task[];
  dependencies: Task[];
  dependentTasks: Task[];
  comments: Comment[];
  timeLogs: TimeLog[];
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
export type IssueStatus = 'open' | 'in_progress' | 'closed';
export type IssuePriority = 'critical' | 'high' | 'medium' | 'low';
export type IssueType = 'bug' | 'feature' | 'improvement' | 'task';

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  severity: 'minor' | 'major' | 'critical';
  priority?: IssuePriority;
  type?: IssueType;
  attachments: string[] | null;
  stepsToReproduce: string | null;
  expectedBehavior: string | null;
  actualBehavior: string | null;
  tags: string[] | null;
  isActive: boolean;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  assignee: User | null;
  assigneeId: string | null;
  reporter: User;
  reporterId: string;
  project: Project;
  projectId: string;
  comments: Comment[];
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
  data: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

// Message Types
export interface Message {
  id: string
  content: string
  type: 'text' | 'file' | 'image'
  attachments: string[]
  isEdited: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  sender: {
    id: string
    name: string
    email: string
    profilePicture?: string
  }
  senderId: string
  projectId: string
}

export interface CreateMessageData {
  content: string
  type?: 'text' | 'file' | 'image'
  attachments?: string[]
  projectId: string
}

export interface UpdateMessageData {
  content?: string
  attachments?: string[]
}

export interface MessageState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  totalCount: number
}

export interface RootState {
  auth: AuthState;
  projects: ProjectState;
  tasks: TaskState;
  issues: IssueState;
  notifications: NotificationState;
  messages: MessageState;
}