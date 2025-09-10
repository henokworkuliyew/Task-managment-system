import api from './api'

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

export interface UpdateEventData extends Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
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

class CalendarService {
  async createEvent(eventData: CreateEventDto): Promise<CalendarEvent> {
    const response = await api.post('/calendar/events', eventData)
    return response.data
  }

  async getEvents(filters?: EventFilters): Promise<CalendarEvent[]> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value)
        }
      })
    }

    const response = await api.get(`/calendar/events?${params.toString()}`)
    // Handle both paginated and direct array responses
    return Array.isArray(response.data) ? response.data : response.data?.data || []
  }

  async getUpcomingEvents(days: number = 7): Promise<CalendarEvent[]> {
    const response = await api.get(`/calendar/events/upcoming?days=${days}`)
    // Handle both paginated and direct array responses
    return Array.isArray(response.data) ? response.data : response.data?.data || []
  }

  async getEventById(id: string): Promise<CalendarEvent> {
    const response = await api.get(`/calendar/events/${id}`)
    return response.data
  }

  async updateEvent(id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const response = await api.put(`/calendar/events/${id}`, eventData)
    return response.data
  }

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/calendar/events/${id}`)
  }

  async getEventsByProject(projectId: string): Promise<CalendarEvent[]> {
    const response = await api.get(`/calendar/projects/${projectId}/events`)
    return Array.isArray(response.data) ? response.data : response.data?.data || []
  }

  async getEventsByTask(taskId: string): Promise<CalendarEvent[]> {
    const response = await api.get(`/calendar/tasks/${taskId}/events`)
    return Array.isArray(response.data) ? response.data : response.data?.data || []
  }

  async getEventsForDateRange(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    const response = await api.get(`/calendar/events?startDate=${startDate}&endDate=${endDate}`)
    return Array.isArray(response.data) ? response.data : response.data?.data || []
  }

  async getEventsForMonth(year: number, month: number): Promise<CalendarEvent[]> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    
    const response = await api.get(`/calendar/events?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`)
    return Array.isArray(response.data) ? response.data : response.data?.data || []
  }
}

export const calendarService = new CalendarService()
