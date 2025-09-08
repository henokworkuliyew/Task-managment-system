'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../types';
import { fetchNotifications, markAsRead } from '../../redux/slices/notificationSlice';
import { NotificationItem } from '../../components/notifications';
import { Card } from '../../components/common';

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { notifications, isLoading } = useAppSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications({}));
  }, [dispatch]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !Array.isArray(notifications) || notifications.length === 0 ? (
        <Card className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
          <p className="mt-2 text-sm text-gray-500">
            You don&apos;t have any notifications at the moment.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              showFullDate
            />
          ))}
        </div>
      )}
    </div>
  );
}