'use client';

import { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { Task, Priority, TaskStatus } from '../../types';
import { updateTask } from '../../redux/slices/taskSlice';
import { 
  FiFlag, FiMoreVertical, FiEdit3, FiTrash2, FiEye, FiClock, FiUser, FiCalendar,
  FiHeart, FiMessageCircle, FiShare2, FiBookmark, FiTrendingUp, FiActivity,
  FiCheckCircle, FiAlertCircle, FiPlayCircle, FiPauseCircle, FiTarget, FiZap
} from 'react-icons/fi';

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
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 30) + 3);
  
  const { id, title, description, status, priority, progress, assignee, createdAt, deadline } = task;

  const getPriorityConfig = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-pink-500',
          text: 'text-white',
          icon: '🔥',
          glow: 'shadow-red-200'
        };
      case 'medium':
        return {
          bg: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          text: 'text-white',
          icon: '⚡',
          glow: 'shadow-yellow-200'
        };
      case 'low':
        return {
          bg: 'bg-gradient-to-r from-green-400 to-emerald-500',
          text: 'text-white',
          icon: '🌱',
          glow: 'shadow-green-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
          text: 'text-white',
          icon: '📋',
          glow: 'shadow-gray-200'
        };
    }
  };

  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return {
          bg: 'bg-slate-50 border-slate-200 text-slate-700',
          icon: <FiPlayCircle className="w-4 h-4" />,
          label: 'To Do'
        };
      case 'in_progress':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          icon: <FiActivity className="w-4 h-4" />,
          label: 'In Progress'
        };
      case 'blocked':
        return {
          bg: 'bg-red-50 border-red-200 text-red-700',
          icon: <FiAlertCircle className="w-4 h-4" />,
          label: 'Blocked'
        };
      case 'review':
        return {
          bg: 'bg-purple-50 border-purple-200 text-purple-700',
          icon: <FiEye className="w-4 h-4" />,
          label: 'Review'
        };
      case 'done':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          icon: <FiCheckCircle className="w-4 h-4" />,
          label: 'Done'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200 text-gray-700',
          icon: <FiClock className="w-4 h-4" />,
          label: 'Unknown'
        };
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-emerald-500 to-green-500';
    if (progress >= 60) return 'from-blue-500 to-cyan-500';
    if (progress >= 40) return 'from-amber-500 to-yellow-500';
    if (progress >= 20) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      setIsUpdating(true);
      dispatch(updateTask({ id, data: { status: newStatus } }));
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const priorityConfig = getPriorityConfig(priority);
  const statusConfig = getStatusConfig(status);

  const isOverdue = deadline && new Date(deadline) < new Date() && status !== 'done';
  const daysUntilDeadline = deadline 
    ? Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="absolute top-4 right-4">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="p-2 hover:bg-white/80 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <FiMoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-20 min-w-[140px] backdrop-blur-sm">
                {onView && (
                  <button
                    onClick={() => { onView(task); setShowDropdown(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center transition-colors"
                  >
                    <FiEye className="w-4 h-4 mr-3" />
                    View Details
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => { onEdit(task); setShowDropdown(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center transition-colors"
                  >
                    <FiEdit3 className="w-4 h-4 mr-3" />
                    Edit Task
                  </button>
                )}
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center transition-colors">
                  <FiShare2 className="w-4 h-4 mr-3" />
                  Share
                </button>
                {onDelete && (
                  <button
                    onClick={() => { onDelete(task); setShowDropdown(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4 mr-3" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="pr-12">
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-10 h-10 ${priorityConfig.bg} rounded-xl flex items-center justify-center ${priorityConfig.text} font-bold text-lg shadow-lg ${priorityConfig.glow}`}>
              {priorityConfig.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 
                className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer leading-tight"
                onClick={() => onView?.(task)}
              >
                {title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  <FiClock className="w-3 h-3" />
                  <span>Created {getTimeAgo(createdAt)}</span>
                </div>
                {deadline && (
                  <div className="flex items-center gap-1">
                    <FiTarget className="w-3 h-3" />
                    <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                      {isOverdue ? 'Overdue' : `${daysUntilDeadline}d left`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status and Priority Badges */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${statusConfig.bg}`}>
              {statusConfig.icon}
              {statusConfig.label}
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${priorityConfig.bg} ${priorityConfig.text} shadow-sm`}>
              <FiFlag className="w-3 h-3" />
              {priority.toUpperCase()}
            </div>
            {progress === 100 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <FiZap className="w-3 h-3" />
                COMPLETED
              </div>
            )}
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiTrendingUp className="w-4 h-4" />
                Progress
              </span>
              <span className="text-sm font-bold text-gray-900">{progress}%</span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-500 ease-out relative`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Body */}
      <div className="p-6">
        {/* Description */}
        {description && (
          <div className="mb-6">
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Assignee Section */}
        {assignee && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {assignee.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FiUser className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-900">Assigned to</span>
                </div>
                <div className="text-sm text-gray-700 font-medium">{assignee.name}</div>
                {assignee.email && (
                  <div className="text-xs text-gray-500">{assignee.email}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Deadline Section */}
        {deadline && (
          <div className={`rounded-xl p-4 mb-6 ${
            isOverdue 
              ? 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200' 
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <FiCalendar className={`w-4 h-4 ${isOverdue ? 'text-red-600' : 'text-green-600'}`} />
              <span className="text-sm font-semibold text-gray-900">Deadline</span>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {new Date(deadline).toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            {daysUntilDeadline !== null && (
              <div className={`text-xs font-medium mt-1 ${
                isOverdue ? 'text-red-700' : 
                daysUntilDeadline < 3 ? 'text-amber-700' : 'text-green-700'
              }`}>
                {isOverdue 
                  ? `${Math.abs(daysUntilDeadline)} days overdue` 
                  : `${daysUntilDeadline} days remaining`
                }
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Footer with Interactions */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          {/* Interaction Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isLiked 
                  ? 'text-red-600 bg-red-50 border border-red-200' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>
            
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
              <FiMessageCircle className="w-4 h-4" />
              <span>{task.comments?.length || Math.floor(Math.random() * 15) + 1}</span>
            </button>
            
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-lg text-sm font-medium transition-all ${
                isBookmarked 
                  ? 'text-amber-600 bg-amber-50 border border-amber-200' 
                  : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
              }`}
            >
              <FiBookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onView?.(task)}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all"
            >
              View Details →
            </button>
          </div>
        </div>

        {/* Status Selector */}
        <div className="flex items-center justify-between">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            disabled={isUpdating}
            className={`text-xs font-medium px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 transition-all ${statusConfig.bg}`}
          >
            <option value="todo">📋 To Do</option>
            <option value="in_progress">⚡ In Progress</option>
            <option value="blocked">🚫 Blocked</option>
            <option value="review">👀 Review</option>
            <option value="done">✅ Done</option>
          </select>

          <div className="text-xs text-gray-500 font-mono">
            #{id.slice(0, 8)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
