'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Issue, IssuePriority, IssueStatus, IssueType } from '../../types';
import { updateIssue } from '../../redux/slices/issueSlice';
import { FiCalendar, FiTag, FiUser, FiAlertCircle } from 'react-icons/fi';

interface IssueCardProps {
  issue: Issue;
  onEdit?: (issue: Issue) => void;
}

const IssueCard = ({ issue, onEdit }: IssueCardProps) => {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { id, title, description, status, priority, type, createdAt, reportedBy, assignedTo, projectId } = issue;

  const getPriorityColor = (priority: IssuePriority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: IssueType) => {
    switch (type) {
      case 'bug':
        return <FiAlertCircle className="text-red-500" />;
      case 'feature':
        return <FiTag className="text-blue-500" />;
      case 'improvement':
        return <FiTag className="text-green-500" />;
      default:
        return <FiTag className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const handleStatusChange = async (newStatus: IssueStatus) => {
    try {
      setIsUpdating(true);
      await dispatch(updateIssue({ id, data: { status: newStatus } }) as any);
    } catch (error) {
      console.error('Error updating issue status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <span className="mr-2">{getTypeIcon(type)}</span>
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        </div>
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
        <div className="flex items-center">
          <FiCalendar className="mr-1" />
          <span>Created: {formatDate(createdAt)}</span>
        </div>
        
        {reportedBy && (
          <div className="flex items-center">
            <FiUser className="mr-1" />
            <span>Reported by: {reportedBy.firstName} </span>
          </div>
        )}
        
        {assignedTo && (
          <div className="flex items-center">
            <FiUser className="mr-1" />
            <span>Assigned to: {assignedTo.firstName} </span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex space-x-2">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as IssueStatus)}
            disabled={isUpdating}
            className="text-xs border rounded px-2 py-1 bg-gray-50"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        
        {onEdit && (
          <button 
            onClick={() => onEdit(issue)}
            className="text-xs text-primary-600 hover:text-primary-800"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default IssueCard;