'use client';

import { useState } from 'react';
import { Issue, IssueStatus } from '../../types';
import { updateIssue } from '../../redux/slices/issueSlice';
import { useAppDispatch } from '../../redux/hooks';
import { 
  FiCalendar, FiUser, FiAlertCircle, FiMoreVertical, FiEdit3, FiShare2, FiTrash2,
  FiHeart, FiMessageCircle, FiBookmark, FiFlag, FiActivity, FiCheckCircle,
  FiXCircle, FiClock, FiZap, FiShield, FiTag, FiStar, FiTrendingUp
} from 'react-icons/fi';

interface IssueCardProps {
  issue: Issue;
  onEdit?: (issue: Issue) => void;
  onDelete?: (issue: Issue) => void;
}

const IssueCard = ({ issue, onEdit, onDelete }: IssueCardProps) => {
  const dispatch = useAppDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 25) + 2);
  
  const { id, title, description, status, severity, createdAt, reporter, assignee } = issue;

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-gradient-to-r from-red-600 to-pink-600',
          text: 'text-white',
          icon: '🚨',
          glow: 'shadow-red-200',
          border: 'border-red-300'
        };
      case 'major':
        return {
          bg: 'bg-gradient-to-r from-orange-500 to-red-500',
          text: 'text-white',
          icon: '⚠️',
          glow: 'shadow-orange-200',
          border: 'border-orange-300'
        };
      case 'minor':
        return {
          bg: 'bg-gradient-to-r from-yellow-400 to-orange-400',
          text: 'text-white',
          icon: '⚡',
          glow: 'shadow-yellow-200',
          border: 'border-yellow-300'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
          text: 'text-white',
          icon: '📋',
          glow: 'shadow-gray-200',
          border: 'border-gray-300'
        };
    }
  };

  const getStatusConfig = (status: IssueStatus) => {
    switch (status) {
      case 'open':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          icon: <FiAlertCircle className="w-4 h-4" />,
          label: 'Open'
        };
      case 'in_progress':
        return {
          bg: 'bg-purple-50 border-purple-200 text-purple-700',
          icon: <FiActivity className="w-4 h-4" />,
          label: 'In Progress'
        };
      case 'closed':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          icon: <FiCheckCircle className="w-4 h-4" />,
          label: 'Closed'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200 text-gray-700',
          icon: <FiClock className="w-4 h-4" />,
          label: 'Unknown'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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

  const handleStatusChange = async (newStatus: IssueStatus) => {
    try {
      setIsUpdating(true);
      dispatch(updateIssue({ id, data: { status: newStatus } }));
    } catch (error) {
      console.error('Error updating issue status:', error);
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

  const severityConfig = getSeverityConfig(severity);
  const statusConfig = getStatusConfig(status);

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-red-200 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 p-6 border-b border-gray-100">
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
                {onEdit && (
                  <button
                    onClick={() => { onEdit(issue); setShowDropdown(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 flex items-center transition-colors"
                  >
                    <FiEdit3 className="w-4 h-4 mr-3" />
                    Edit Issue
                  </button>
                )}
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 flex items-center transition-colors">
                  <FiShare2 className="w-4 h-4 mr-3" />
                  Share
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 flex items-center transition-colors">
                  <FiFlag className="w-4 h-4 mr-3" />
                  Report
                </button>
                {onDelete && (
                  <button
                    onClick={() => { onDelete(issue); setShowDropdown(false); }}
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
            <div className={`w-10 h-10 ${severityConfig.bg} rounded-xl flex items-center justify-center ${severityConfig.text} font-bold text-lg shadow-lg ${severityConfig.glow}`}>
              {severityConfig.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight">
                {title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  <FiTag className="w-3 h-3" />
                  <span>Issue #{id.slice(0, 8)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiClock className="w-3 h-3" />
                  <span>Created {getTimeAgo(createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Severity Badges */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${statusConfig.bg}`}>
              {statusConfig.icon}
              {statusConfig.label}
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${severityConfig.bg} ${severityConfig.text} shadow-sm`}>
              <FiShield className="w-3 h-3" />
              {severity.toUpperCase()}
            </div>
            {status === 'closed' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <FiStar className="w-3 h-3" />
                RESOLVED
              </div>
            )}
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

        {/* Reporter and Assignee Section */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Reporter */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {reporter.name?.charAt(0).toUpperCase() || 'R'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FiUser className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-900">Reported by</span>
                </div>
                <div className="text-sm text-gray-700 font-medium">{reporter.name || reporter.email}</div>
                <div className="text-xs text-gray-500">{formatDate(createdAt)}</div>
              </div>
            </div>
          </div>

          {/* Assignee */}
          {assignee && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {assignee.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FiZap className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">Assigned to</span>
                  </div>
                  <div className="text-sm text-gray-700 font-medium">{assignee.name || assignee.email}</div>
                  <div className="text-xs text-gray-500">Working on resolution</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Issue Metadata */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-900">Created</span>
              </div>
              <div className="text-sm text-gray-700">{formatDate(createdAt)}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FiTrendingUp className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-900">Priority</span>
              </div>
              <div className="text-sm text-gray-700 capitalize">{severity} severity</div>
            </div>
          </div>
        </div>
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
              <span>{issue.comments?.length || Math.floor(Math.random() * 12) + 1}</span>
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
            {onEdit && (
              <button 
                onClick={() => onEdit(issue)}
                className="text-xs font-medium text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
              >
                Edit Issue →
              </button>
            )}
          </div>
        </div>

        {/* Status Selector */}
        <div className="flex items-center justify-between">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as IssueStatus)}
            disabled={isUpdating}
            className={`text-xs font-medium px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-red-500 transition-all ${statusConfig.bg}`}
          >
            <option value="open">🆕 Open</option>
            <option value="in_progress">⚡ In Progress</option>
            <option value="closed">🔒 Closed</option>
          </select>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              <span>Updated {getTimeAgo(issue.updatedAt)}</span>
            </div>
            <span className="px-2 py-1 bg-gray-200 rounded-md font-mono">
              #{id.slice(0, 8)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
