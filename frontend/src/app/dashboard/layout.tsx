'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTasks, FaProjectDiagram, FaBug, FaBell, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProtectedRoute } from '../../components/common';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notifications);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FaUser },
    { name: 'Projects', href: '/projects', icon: FaProjectDiagram },
    { name: 'Tasks', href: '/tasks', icon: FaTasks },
    { name: 'Issues', href: '/issues', icon: FaBug },
    { name: 'Notifications', href: '/notifications', icon: FaBell, badge: unreadCount },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <ToastContainer position="top-right" autoClose={5000} />
        
        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-white font-bold text-xl">Task Management</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 flex-shrink-0 h-6 w-6 ${isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}`}
                        aria-hidden="true"
                      />
                      {item.name}
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
                >
                  <FaSignOutAlt
                    className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300"
                    aria-hidden="true"
                  />
                  Logout
                </button>
              </nav>
            </div>
            <div className="flex-shrink-0 flex bg-gray-700 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-semibold text-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user?.firstName || 'User'}</p>
                    <p className="text-xs font-medium text-gray-300 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => document.querySelector('.mobile-menu')?.classList.toggle('hidden')}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          <div className="mobile-menu hidden md:hidden absolute top-0 left-0 w-full h-full bg-gray-800 z-20">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h1 className="text-white font-bold text-xl">Task Management</h1>
              <button
                onClick={() => document.querySelector('.mobile-menu')?.classList.toggle('hidden')}
                className="text-gray-300 hover:text-white"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={() => document.querySelector('.mobile-menu')?.classList.toggle('hidden')}
                  >
                    <item.icon
                      className={`mr-4 flex-shrink-0 h-6 w-6 ${isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}`}
                      aria-hidden="true"
                    />
                    {item.name}
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  document.querySelector('.mobile-menu')?.classList.toggle('hidden');
                  handleLogout();
                }}
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
              >
                <FaSignOutAlt
                  className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300"
                  aria-hidden="true"
                />
                Logout
              </button>
            </nav>
            <div className="border-t border-gray-700 p-4">
              <div className="flex items-center">
                <div>
                  <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-semibold text-lg">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                  <p className="text-xs font-medium text-gray-300 truncate">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}