'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  FaBell, 
  FaCheck, 
  FaTrash, 
  FaEye,
  FaClock,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle
} from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchNotifications, 
  fetchUnreadCount, 
  markAsRead, 
  markAllAsRead,
  deleteNotification 
} from '../../redux/slices/notificationSlice';
import { Notification } from '../../types';

interface NotificationDropdownProps {
  unreadCount: number;
}

export default function NotificationDropdown({ unreadCount }: NotificationDropdownProps) {
  const dispatch = useAppDispatch();
  const { notifications, isLoading } = useAppSelector((state) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      console.log('Fetching notifications...');
      dispatch(fetchNotifications({ limit: 10 }));
    }
  }, [dispatch, isOpen]);

  // Debug logging
  useEffect(() => {
    console.log('Notifications state:', { notifications, isLoading, isOpen });
  }, [notifications, isLoading, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(markAsRead(id)).then(() => {
      // Refresh unread count after marking as read
      dispatch(fetchUnreadCount());
    });
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead()).then(() => {
      // Refresh unread count after marking all as read
      dispatch(fetchUnreadCount());
    });
  };

  const handleDeleteNotification = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(deleteNotification(id)).then(() => {
      // Refresh unread count after deleting notification
      dispatch(fetchUnreadCount());
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <FaExclamationTriangle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <FaExclamationTriangle className="w-4 h-4 text-red-500" />;
      case 'info':
      default:
        return <FaInfoCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-xl bg-slate-100/50 hover:bg-slate-200/50 text-slate-600 hover:text-slate-800 transition-all duration-200 group"
      >
        <FaBell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-200"></div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-200/50 z-50 max-h-[500px] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200/50 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <Link
                  href="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-slate-600 hover:text-slate-800 font-medium px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
                >
                  View all
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : !Array.isArray(notifications) || notifications.length === 0 ? (
              <div className="text-center py-8 px-6">
                <FaBell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-medium text-slate-600 mb-1">No notifications</h4>
                <p className="text-xs text-slate-500">You&apos;re all caught up!</p>
              </div>
            ) : (
              <div className="py-2">
                {notifications.slice(0, 10).map((notification: Notification) => (
                  <div
                    key={notification.id}
                    className={`px-6 py-4 border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors cursor-pointer group ${
                      !notification.read ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'text-slate-900' : 'text-slate-700'} line-clamp-2`}>
                              {notification.message}
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <FaClock className="w-3 h-3" />
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <button
                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                title="Mark as read"
                              >
                                <FaCheck className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDeleteNotification(notification.id, e)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {Array.isArray(notifications) && notifications.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-200/50 bg-slate-50/50">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                View all {notifications.length} notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
