'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaBell, 
  FaUser, 
  FaSignOutAlt, 
  FaCog, 
  FaChevronDown,
  FaCircle
} from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import { fetchUnreadCount } from '../../redux/slices/notificationSlice';
import { NotificationDropdown } from '../notifications';

export default function Header() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const notifications = useAppSelector((state) => state.notifications);
  const unreadCount = notifications?.unreadCount || 0;
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch unread count on component mount and periodically
    dispatch(fetchUnreadCount());
    
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
  };

  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/projects':
        return 'Projects';
      case '/tasks':
        return 'Tasks';
      case '/issues':
        return 'Issues';
      case '/calendar':
        return 'Calendar';
      case '/notifications':
        return 'Notifications';
      case '/profile':
        return 'Profile';
      case '/settings':
        return 'Settings';
      default:
        if (pathname.includes('/projects/')) return 'Project Details';
        if (pathname.includes('/tasks/')) return 'Task Details';
        if (pathname.includes('/issues/')) return 'Issue Details';
        return 'TaskFlow';
    }
  };

  return (
    <header className="bg-white backdrop-blur-lg border-b border-slate-300 shadow-lg sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Page Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {getPageTitle()}
          </h1>
          <div className="hidden md:flex items-center text-sm text-slate-500">
            <span>Welcome back, {user?.name || 'User'}</span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationDropdown unreadCount={unreadCount} />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-xl bg-slate-100/50 hover:bg-slate-200/50 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500 truncate max-w-32">{user?.email || 'user@example.com'}</p>
              </div>
              <FaChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-200/50 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-slate-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                      <div className="flex items-center mt-1">
                        <FaCircle className="w-2 h-2 text-green-400" />
                        <span className="ml-1 text-xs text-slate-500">Online</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    href="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-100/50 transition-colors duration-200"
                  >
                    <FaUser className="w-4 h-4 mr-3 text-slate-500" />
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-100/50 transition-colors duration-200"
                  >
                    <FaCog className="w-4 h-4 mr-3 text-slate-500" />
                    Settings
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-slate-200/50 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 transition-colors duration-200"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
