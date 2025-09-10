export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: string
  endDate?: string
  allDay: boolean
  type: 'meeting' | 'deadline' | 'reminder' | 'milestone' | 'personal'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  visibility: 'private' | 'project_members' | 'public'
  location?: string
  attendees?: string[]
  reminders?: { minutes: number; type: 'email' | 'notification' }[]
  projectId?: string
  taskId?: string
  isRecurring: boolean
  recurrenceRule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: string
    count?: number
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
    email: string
  }
  project?: {
    id: string
    name: string
  }
  task?: {
    id: string
    title: string
  }
}

export interface CreateEventDto {
  title: string
  description?: string
  startDate: string
  endDate?: string
  allDay?: boolean
  type?: 'meeting' | 'deadline' | 'reminder' | 'milestone' | 'personal'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  visibility?: 'private' | 'project_members' | 'public'
  location?: string
  attendees?: string[]
  reminders?: { minutes: number; type: 'email' | 'notification' }[]
  projectId?: string
  taskId?: string
  isRecurring?: boolean
  recurrenceRule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: string
    count?: number
  }
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  allDay?: boolean;
  type?: 'meeting' | 'deadline' | 'reminder' | 'milestone' | 'personal';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  visibility?: 'public' | 'private';
  location?: string;
  attendees?: string[];
  reminders?: { minutes: number; type: 'email' | 'notification' }[];
  projectId?: string;
  taskId?: string;
  isRecurring?: boolean;
  recurrenceRule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
    count?: number;
  };
}

export interface EventFilters {
  startDate?: string
  endDate?: string
  type?: string
  priority?: string
  visibility?: string
  projectId?: string
  taskId?: string
  createdById?: string
}
