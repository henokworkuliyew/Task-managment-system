'use client';

import { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { Notification } from '../../types';
import { markAsRead } from '../../redux/slices/notificationSlice';
import { FiCheck, FiClock, FiBell } from 'react-icons/fi';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  showFullDate?: boolean;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const dispatch = useAppDispatch();
  const [isMarking, setIsMarking] = useState(false);
  
  const { id, message, type, createdAt, read } = notification;

  const getTypeIcon = () => {
    switch (type) {
      case 'task_assigned':
      case 'task_updated':
        return <FiClock className="text-blue-500" />;
      case 'project_member_added':
        return <FiBell className="text-green-500" />;
      case 'comment_added':
      case 'mention':
        return <FiBell className="text-purple-500" />;
      case 'deadline_reminder':
        return <FiClock className="text-orange-500" />;
      default:
        return <FiBell className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleMarkAsRead = async () => {
    if (read) return;
    
    try {
      setIsMarking(true);
      await dispatch(markAsRead(id));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <div 
      className={`p-4 border-b ${read ? 'bg-white' : 'bg-blue-50'} hover:bg-gray-50 transition-colors`}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getTypeIcon()}
        </div>
        <div className="flex-grow">
          <p className="text-sm text-gray-800">{message}</p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(createdAt)}</p>
        </div>
        <div className="flex-shrink-0 ml-3">
          {read ? (
            <FiCheck className="text-green-500" />
          ) : (
            <button 
              className="text-xs text-primary-600 hover:text-primary-800"
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsRead();
              }}
              disabled={isMarking}
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;