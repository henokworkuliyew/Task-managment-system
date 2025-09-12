'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaTasks, 
  FaProjectDiagram, 
  FaBug, 
  FaBell, 
  FaSignOutAlt, 
  FaHome,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt
} from 'react-icons/fa';
import { ProtectedRoute } from '../common';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import { fetchUnreadCount } from '../../redux/slices/notificationSlice';
import Header from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch unread notification count on component mount only
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FaHome, color: 'from-blue-500 to-blue-600' },
    { name: 'Projects', href: '/projects', icon: FaProjectDiagram, color: 'from-purple-500 to-purple-600' },
    { name: 'Tasks', href: '/tasks', icon: FaTasks, color: 'from-green-500 to-green-600' },
    { name: 'Issues', href: '/issues', icon: FaBug, color: 'from-red-500 to-red-600' },
    { name: 'Calendar', href: '/calendar', icon: FaCalendarAlt, color: 'from-indigo-500 to-indigo-600' },
    { name: 'Notifications', href: '/notifications', icon: FaBell, badge: unreadCount, color: 'from-yellow-500 to-yellow-600' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Sidebar for desktop */}
        <div className={`hidden md:flex ${sidebarCollapsed ? 'md:w-20' : 'md:w-72'} md:flex-col md:fixed md:inset-y-0 transition-all duration-300 ease-in-out z-30`}>
          <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-r border-slate-700/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FaTasks className="text-white text-lg" />
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-xl tracking-tight">TaskFlow</h1>
                    <p className="text-slate-400 text-xs">Management System</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
              >
                {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
              <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-[1.02]`
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:scale-[1.01]'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                        isActive ? 'bg-white/20' : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                      } transition-all duration-200`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      {!sidebarCollapsed && (
                        <>
                          <span className="ml-4 font-medium">{item.name}</span>
                          {item.badge && item.badge > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full shadow-lg animate-pulse">
                              {item.badge}
                            </span>
                          )}
                          {isActive && (
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
                
                {/* Logout Button */}
                <div className="pt-4 mt-4 border-t border-slate-700/50">
                  <button
                    onClick={handleLogout}
                    className="group w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700/50 group-hover:bg-red-500/20 transition-all duration-200">
                      <FaSignOutAlt className="h-4 w-4" />
                    </div>
                    {!sidebarCollapsed && <span className="ml-4 font-medium">Logout</span>}
                  </button>
                </div>
              </nav>
            </div>

            {/* User Profile */}
            <div className="flex-shrink-0 border-t border-slate-700/50 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                {!sidebarCollapsed && (
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="ml-2 text-xs text-slate-400">Online</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className={`${sidebarCollapsed ? 'md:pl-20' : 'md:pl-72'} flex flex-col flex-1 transition-all duration-300`}>
          <div className="sticky top-0 z-20 md:hidden bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FaTasks className="text-white text-sm" />
                </div>
                <h1 className="text-slate-900 font-bold text-lg">TaskFlow</h1>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors duration-200"
              >
                {mobileMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm">
              <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FaTasks className="text-white text-lg" />
                    </div>
                    <div>
                      <h1 className="text-white font-bold text-xl">TaskFlow</h1>
                      <p className="text-slate-400 text-xs">Management System</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group relative flex items-center px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                        }`}
                      >
                        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                          isActive ? 'bg-white/20' : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                        } transition-all duration-200`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span className="ml-4 font-medium">{item.name}</span>
                        {item.badge && item.badge > 0 && (
                          <span className="ml-auto inline-flex items-center justify-center px-3 py-1 text-sm font-bold leading-none text-white bg-red-500 rounded-full shadow-lg">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                  
                  {/* Mobile Logout */}
                  <div className="pt-6 mt-6 border-t border-slate-700/50">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="group w-full flex items-center px-4 py-4 text-base font-medium rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700/50 group-hover:bg-red-500/20 transition-all duration-200">
                        <FaSignOutAlt className="h-5 w-5" />
                      </div>
                      <span className="ml-4 font-medium">Logout</span>
                    </button>
                  </div>
                </nav>

                {/* Mobile User Profile */}
                <div className="border-t border-slate-700/50 p-6">
                  <div className="flex items-center">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-base font-semibold text-white truncate">{user?.name || 'User'}</p>
                      <p className="text-sm text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
                      <div className="flex items-center mt-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="ml-2 text-sm text-slate-400">Online</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <Header />

          <main className="flex-1 min-h-0">
            <div className="h-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-slate-50 rounded-2xl shadow-xl border border-slate-200 min-h-[calc(100vh-12rem)] overflow-auto">
                  <div className="p-6">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
