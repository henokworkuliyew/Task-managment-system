'use client';

import { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { Task, Priority, TaskStatus } from '../../types';
import { updateTask } from '../../redux/slices/taskSlice';
import { FiFlag, FiMoreVertical, FiEdit3, FiTrash2, FiEye, FiClock } from 'react-icons/fi';

interface TaskCardProps {
  task: Task;
  onView?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const TaskCard = ({ task, onView, onEdit, onDelete }: TaskCardProps) => {
  const dispatch = useAppDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { id, title, description, status, priority, progress, assignee, createdAt } = task;

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


  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      setIsUpdating(true);
      dispatch(updateTask({ id, data: { status: newStatus as 'todo' | 'in_progress' | 'review' | 'done' } }));
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => onView?.(task)}>
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiClock className="w-3 h-3" />
            <span>Created {getTimeAgo(createdAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(priority)}`}>
            <FiFlag className="w-3 h-3 mr-1" />
            {priority}
          </span>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiMoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {onView && (
                  <button
                    onClick={() => { onView(task); setShowDropdown(false); }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FiEye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => { onEdit(task); setShowDropdown(false); }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FiEdit3 className="w-4 h-4 mr-2" />
                    Edit Task
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => { onDelete(task); setShowDropdown(false); }}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Description */}
      {description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-700">Progress</span>
          <span className="text-xs text-gray-500">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Assignee */}
      {assignee && assignee.name && (
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
            {assignee.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-600">{assignee.name}</span>
        </div>
      )}
      
      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            disabled={isUpdating}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(status)}`}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
        
        <button 
          onClick={() => onView?.(task)}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Details →
        </button>
      </div>
    </div>
  );
};

export default TaskCard;