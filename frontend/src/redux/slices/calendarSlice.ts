import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { calendarService } from '../../services/calendarService'
import { CalendarEvent, CreateEventDto, UpdateEventDto, EventFilters } from '../../types/calendar'

interface CalendarState {
  events: CalendarEvent[]
  selectedEvent: CalendarEvent | null
  loading: boolean
  error: string | null
  filters: EventFilters
}

const initialState: CalendarState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
  filters: {}
}

export const fetchEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async (filters?: EventFilters) => {
    return await calendarService.getEvents(filters)
  }
)

export const fetchEventsForMonth = createAsyncThunk(
  'calendar/fetchEventsForMonth',
  async ({ year, month }: { year: number; month: number }) => {
    return await calendarService.getEventsForMonth(year, month)
  }
)

export const fetchUpcomingEvents = createAsyncThunk(
  'calendar/fetchUpcomingEvents',
  async (days: number = 7) => {
    return await calendarService.getUpcomingEvents(days)
  }
)

export const fetchEventById = createAsyncThunk(
  'calendar/fetchEventById',
  async (id: string) => {
    return await calendarService.getEventById(id)
  }
)

export const createEvent = createAsyncThunk(
  'calendar/createEvent',
  async (eventData: CreateEventDto) => {
    return await calendarService.createEvent(eventData)
  }
)

export const updateEvent = createAsyncThunk(
  'calendar/updateEvent',
  async ({ id, eventData }: { id: string; eventData: UpdateEventDto }) => {
    return await calendarService.updateEvent(id, eventData)
  }
)

export const deleteEvent = createAsyncThunk(
  'calendar/deleteEvent',
  async (id: string) => {
    await calendarService.deleteEvent(id)
    return id
  }
)

export const fetchEventsByProject = createAsyncThunk(
  'calendar/fetchEventsByProject',
  async (projectId: string) => {
    return await calendarService.getEventsByProject(projectId)
  }
)

export const fetchEventsByTask = createAsyncThunk(
  'calendar/fetchEventsByTask',
  async (taskId: string) => {
    return await calendarService.getEventsByTask(taskId)
  }
)

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null
    },
    setFilters: (state, action) => {
      state.filters = action.payload
    },
    clearFilters: (state) => {
      state.filters = {}
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch events'
      })

      // Fetch Events for Month
      .addCase(fetchEventsForMonth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventsForMonth.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
      })
      .addCase(fetchEventsForMonth.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch events for month'
      })

      // Fetch Upcoming Events
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch upcoming events'
      })

      // Fetch Event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedEvent = action.payload
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch event'
      })

      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events.push(action.payload)
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create event'
      })

      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false
        const index = state.events.findIndex(event => event.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
        if (state.selectedEvent?.id === action.payload.id) {
          state.selectedEvent = action.payload
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update event'
      })

      // Delete Event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events = state.events.filter(event => event.id !== action.payload)
        if (state.selectedEvent?.id === action.payload) {
          state.selectedEvent = null
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete event'
      })

      // Fetch Events by Project
      .addCase(fetchEventsByProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventsByProject.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
      })
      .addCase(fetchEventsByProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch project events'
      })

      // Fetch Events by Task
      .addCase(fetchEventsByTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventsByTask.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
      })
      .addCase(fetchEventsByTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch task events'
      })
  }
})

export const {
  setSelectedEvent,
  clearSelectedEvent,
  setFilters,
  clearFilters,
  clearError
} = calendarSlice.actions

export default calendarSlice.reducer
