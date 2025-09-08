'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchNotifications } from '../../redux/slices/notificationSlice';
import { Notification } from '../../types';
import NotificationItem from './NotificationItem';

interface NotificationListProps {
  limit?: number;
}

const NotificationList = ({ limit }: NotificationListProps) => {
  const dispatch = useAppDispatch();
  const { notifications, isLoading } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications({ limit }));
  }, [dispatch, limit]);

  const displayNotifications = limit ? notifications.slice(0, limit) : notifications;

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading notifications...
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No notifications
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {displayNotifications.map((notification: Notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
      {limit && notifications.length > limit && (
        <div className="p-2 text-center">
          <a href="/notifications" className="text-sm text-primary-600 hover:text-primary-800">
            View all notifications
          </a>
        </div>
      )}
    </div>
  );
};

export default NotificationList;