'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Task, Priority, TaskStatus } from '../../types';
import { updateTask } from '../../redux/slices/taskSlice';
import { FiCalendar,  FiUser } from 'react-icons/fi';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { id, title, description, status, priority, dueDate, assignedTo,  } = task;

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-purple-100 text-purple-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      setIsUpdating(true);
      await dispatch(updateTask({ id, data: { status: newStatus } }) as any);
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <div className="flex space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(priority)}`}>
            {priority}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
            {status.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      {description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>
      )}
      
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
        {dueDate && (
          <div className="flex items-center">
            <FiCalendar className="mr-1" />
            <span>Due: {formatDate(dueDate)}</span>
          </div>
        )}
        
        {assignedTo && (
          <div className="flex items-center">
            <FiUser className="mr-1" />
            <span>Assigned to: {assignedTo.name}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex space-x-2">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            disabled={isUpdating}
            className="text-xs border rounded px-2 py-1 bg-gray-50"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
        
        {onEdit && (
          <button 
            onClick={() => onEdit(task)}
            className="text-xs text-primary-600 hover:text-primary-800"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;