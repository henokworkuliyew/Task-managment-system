'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { fetchTasks } from '../../redux/slices/taskSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { Task, Project } from '../../types';
import { 
  FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiFlag, 
  FiUser, FiFilter, FiPlus, FiGrid, FiList 
} from 'react-icons/fi';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'task' | 'project';
  priority: 'low' | 'medium' | 'high';
  status: string;
  assignee?: string;
  project?: string;
}

const CalendarView = () => {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector((state) => state.tasks);
  const { projects } = useAppSelector((state) => state.projects);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'tasks' | 'projects'>('all');
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    dispatch(fetchTasks({}));
    dispatch(fetchProjects({}));
  }, [dispatch]);

  useEffect(() => {
    const calendarEvents: CalendarEvent[] = [];

    // Add task deadlines
    if (Array.isArray(tasks)) {
      tasks.forEach((task: Task) => {
        if (task.deadline) {
          calendarEvents.push({
            id: task.id,
            title: task.title,
            date: task.deadline,
            type: 'task',
            priority: task.priority,
            status: task.status,
            assignee: task.assignee?.name,
            project: task.project?.name
          });
        }
      });
    }

    // Add project deadlines
    if (Array.isArray(projects)) {
      projects.forEach((project: Project) => {
        if (project.endDate) {
          calendarEvents.push({
            id: project.id,
            title: project.name,
            date: project.endDate,
            type: 'project',
            priority: project.priority,
            status: project.status,
            project: project.name
          });
        }
      });
    }

    setEvents(calendarEvents);
  }, [tasks, projects, events]);

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
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === dateStr && (filterType === 'all' || filterType === `${event.type}s`);
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isOverdue = (date: string, status: string) => {
    const eventDate = new Date(date);
    const today = new Date();
    return eventDate < today && status !== 'done' && status !== 'completed';
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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FiCalendar className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiClock className="w-4 h-4" />
              <span>Schedule Overview</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filter Dropdown */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'projects' | 'tasks')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Events</option>
              <option value="tasks">Tasks Only</option>
              <option value="projects">Projects Only</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'month' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'week' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {dayNames.map(day => (
            <div key={day} className="p-4 text-center text-sm font-semibold text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-32 border-b border-r border-gray-200"></div>;
            }

            const dayEvents = getEventsForDate(day);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`h-32 border-b border-r border-gray-200 p-2 hover:bg-gray-50 transition-colors cursor-pointer ${
                  isCurrentDay ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isCurrentDay 
                    ? 'text-blue-600 bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center' 
                    : 'text-gray-900'
                }`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded text-white truncate ${
                        event.type === 'task' ? 'bg-blue-500' : 'bg-purple-500'
                      } ${isOverdue(event.date, event.status) ? 'bg-red-500' : ''}`}
                      title={`${event.title} - ${event.type} (${event.priority})`}
                    >
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`}></div>
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Sidebar */}
      {selectedDate && (
        <div className="fixed right-6 top-6 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            {getEventsForDate(selectedDate).map(event => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border-l-4 ${
                  event.type === 'task' ? 'border-blue-500 bg-blue-50' : 'border-purple-500 bg-purple-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(event.priority)}`}></div>
                </div>
                
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{event.type}</span>
                    <span>•</span>
                    <span className="capitalize">{event.priority} priority</span>
                  </div>
                  
                  {event.assignee && (
                    <div className="flex items-center gap-1">
                      <FiUser className="w-3 h-3" />
                      <span>{event.assignee}</span>
                    </div>
                  )}
                  
                  {event.project && (
                    <div className="flex items-center gap-1">
                      <FiFlag className="w-3 h-3" />
                      <span>{event.project}</span>
                    </div>
                  )}
                  
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    isOverdue(event.date, event.status)
                      ? 'bg-red-100 text-red-800'
                      : event.status === 'done' || event.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
            
            {getEventsForDate(selectedDate).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FiCalendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No events scheduled for this day</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
