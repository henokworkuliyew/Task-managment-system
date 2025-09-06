'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { FiMenu, FiX, FiHome, FiFolder, FiCheckSquare, FiAlertCircle, FiBell, FiUser, FiLogOut } from 'react-icons/fi';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);

  const handleLogout = async () => {
    await dispatch(logout() as any);
    router.push('/auth/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Projects', href: '/projects', icon: <FiFolder className="w-5 h-5" /> },
    { name: 'Tasks', href: '/tasks', icon: <FiCheckSquare className="w-5 h-5" /> },
    { name: 'Issues', href: '/issues', icon: <FiAlertCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out fixed h-full z-10`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-primary-600">TaskManager</h1>
          ) : (
            <h1 className="text-xl font-bold text-primary-600">TM</h1>
          )}
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100">
            {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="px-4 py-2">
                <Link
                  href={item.href}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <span className="mr-3">{item.icon}</span>
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              {sidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-500"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-end p-4">
            <Link href="/profile" className="p-2 rounded-md hover:bg-gray-100 mr-2">
              <FiUser className="w-5 h-5" />
            </Link>
            <Link href="/notifications" className="p-2 rounded-md hover:bg-gray-100 relative">
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;