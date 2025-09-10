'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUser, 
  FiFilter, 
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Task, Project } from '../../types';
import { CalendarEvent } from '../../types/calendar';
import { 
  fetchEventsForMonth, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  setSelectedEvent,
  clearSelectedEvent 
} from '../../redux/slices/calendarSlice';

interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  type: 'meeting' | 'deadline' | 'reminder' | 'milestone' | 'personal';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  visibility: 'private' | 'project_members' | 'public';
  location: string;
  projectId: string;
  taskId: string;
}

export default function EnhancedCalendarView() {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);
  const { tasks } = useAppSelector((state) => state.tasks);
  const { events, loading, error, selectedEvent } = useAppSelector((state) => state.calendar);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filter, setFilter] = useState<'all' | 'tasks' | 'projects' | 'events'>('all');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    allDay: false,
    type: 'meeting',
    priority: 'medium',
    visibility: 'private',
    location: '',
    projectId: '',
    taskId: ''
  });

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    dispatch(fetchEventsForMonth({ year, month }));
  }, [dispatch, currentDate]);

  const allEvents = useMemo(() => {
    const taskEvents = (tasks || []).map((task: Task) => ({
      id: `task-${task.id}`,
      title: task.title,
      date: new Date(task.deadline || task.createdAt),
      type: 'task' as const,
      priority: task.priority,
      project: projects.find((p: Project) => p.id === task.projectId)?.name || 'No Project',
      description: task.description,
      assignee: task.assignee?.name || 'Unassigned',
      status: task.status,
      isOverdue: task.deadline && new Date(task.deadline) < new Date() && task.status !== 'done'
    }));

    const projectEvents = (projects || []).map((project: Project) => ({
      id: `project-${project.id}`,
      title: project.name,
      date: new Date(project.endDate || project.createdAt),
      type: 'project' as const,
      priority: project.priority,
      project: project.name,
      description: project.description,
      assignee: project.owner?.name || 'No Owner',
      status: project.status,
      isOverdue: project.endDate && new Date(project.endDate) < new Date() && project.status !== 'completed'
    }));

    const calendarEvents = (events || []).map((event: CalendarEvent) => ({
      id: `event-${event.id}`,
      title: event.title,
      date: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : undefined,
      type: 'event' as const,
      priority: event.priority,
      project: event.project?.name || 'Personal',
      description: event.description || '',
      assignee: event.createdBy.name,
      status: 'active',
      isOverdue: false,
      allDay: event.allDay,
      location: event.location,
      eventType: event.type,
      visibility: event.visibility,
      originalEvent: event
    }));

    return [...taskEvents, ...projectEvents, ...calendarEvents];
  }, [tasks, projects, events]);

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return allEvents;
    if (filter === 'tasks') return allEvents.filter(event => event.type === 'task');
    if (filter === 'projects') return allEvents.filter(event => event.type === 'project');
    if (filter === 'events') return allEvents.filter(event => event.type === 'event');
    return allEvents;
  }, [allEvents, filter]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      startDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      endDate: '',
      allDay: false,
      type: 'meeting',
      priority: 'medium',
      visibility: 'private',
      location: '',
      projectId: '',
      taskId: ''
    });
    setShowEventForm(true);
  };


  const handleDeleteEvent = (event: { id: string; extendedProps?: Record<string, unknown> }) => {
    if (event.extendedProps && window.confirm('Are you sure you want to delete this event?')) {
      dispatch(deleteEvent(event.id));
    }
  };

  const handleResize = (info: { event: { id: string; start: Date; end?: Date } }) => {
    setSelectedDate(info.event.start);
  };

  const handleDrop = (info: { event: { id: string; start: Date; end?: Date } }) => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      startDate: info.event.start.toISOString().split('T')[0],
      endDate: info.event.end ? info.event.end.toISOString().split('T')[0] : '',
      allDay: false,
      type: 'meeting',
      priority: 'medium',
      visibility: 'private',
      location: '',
      projectId: '',
      taskId: ''
    });
    setShowEventForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      projectId: formData.projectId || undefined,
      taskId: formData.taskId || undefined,
      type: formData.type,
      visibility: formData.visibility === 'project_members' ? 'public' : formData.visibility as 'private' | 'public'
    };

    try {
      if (editingEvent) {
        dispatch(updateEvent({ id: editingEvent.id, eventData }));
      } else {
        dispatch(createEvent(eventData));
      }
      setShowEventForm(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'task': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'project': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'event': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiCalendar className="text-blue-600" />
            Calendar
          </h1>
          
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'tasks' | 'projects' | 'events')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Events</option>
              <option value="tasks">Tasks Only</option>
              <option value="projects">Projects Only</option>
              <option value="events">Calendar Events</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateEvent}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            New Event
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center font-medium text-gray-500 bg-gray-50 rounded-lg">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth(currentDate).map((date, index) => (
          <div
            key={index}
            className={`min-h-[120px] p-2 border border-gray-200 rounded-lg cursor-pointer transition-colors duration-200 ${
              date ? 'hover:bg-blue-50' : ''
            } ${
              date && selectedDate && date.toDateString() === selectedDate.toDateString()
                ? 'bg-blue-100 border-blue-300'
                : ''
            } ${
              date && date.toDateString() === new Date().toDateString()
                ? 'bg-yellow-50 border-yellow-300'
                : ''
            }`}
            onClick={() => date && handleDateClick(date)}
          >
            {date && (
              <>
                <div className="font-medium text-gray-900 mb-1">
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {getEventsForDate(date).slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs p-1 rounded border ${getTypeColor(event.type)} truncate group relative`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate flex-1">{event.title}</span>
                        {event.type === 'event' && (
                          <div className="opacity-0 group-hover:opacity-100 flex gap-1 ml-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCreateEvent();
                              }}
                              className="p-0.5 hover:bg-white rounded"
                            >
                              <FiEdit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(event);
                              }}
                              className="p-0.5 hover:bg-white rounded text-red-600"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)} inline-block mr-1`}></div>
                      {event.isOverdue && (
                        <span className="text-red-600 font-bold">!</span>
                      )}
                    </div>
                  ))}
                  {getEventsForDate(date).length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{getEventsForDate(date).length - 3} more
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button
                onClick={() => setShowEventForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={formData.allDay}
                  onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="allDay" className="text-sm font-medium text-gray-700">
                  All Day Event
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'meeting' | 'deadline' | 'reminder' | 'milestone' | 'personal' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Deadline</option>
                    <option value="reminder">Reminder</option>
                    <option value="milestone">Milestone</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visibility
                </label>
                <select
                  value={formData.visibility}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'private' | 'project_members' | 'public' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="private">Private</option>
                  <option value="project_members">Project Members</option>
                  <option value="public">Public</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Meeting room, address, or online link"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project (Optional)
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">No Project</option>
                    {projects.map((project: Project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task (Optional)
                  </label>
                  <select
                    value={formData.taskId}
                    onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">No Task</option>
                    {tasks.map((task: Task) => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEventForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading events...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
