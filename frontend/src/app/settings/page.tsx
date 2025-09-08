'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateSettings } from "../../redux/slices/authSlice"
import { Button } from '../../components/common';
import { 
  FiSave, 
  FiMoon, 
  FiSun, 
  FiBell, 
  FiLock, 
  FiMail, 
  FiShield,
  FiSettings,
  FiEdit3,
  FiKey,
  FiGlobe,
  FiSmartphone,
  FiArrowLeft,
  FiEye
} from 'react-icons/fi';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { user, isLoading: loading } = useAppSelector((state) => state.auth);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: true,
    twoFactorAuth: false,
  });

  const handleToggle = (setting: string) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting as keyof typeof settings],
    });
  };

  const handleSaveSettings = async () => {
    try {
      await dispatch(updateSettings({ settings }));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                icon={FiArrowLeft}
                onClick={() => router.push('/dashboard')}
                className="hover:bg-slate-100"
              >
                Back
              </Button>
              <div className="h-8 w-px bg-slate-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FiSettings className="mr-3 h-6 w-6 text-blue-500" />
                  Settings
                </h1>
                <p className="text-sm text-gray-600">Manage your account preferences</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {updateSuccess && (
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg border border-green-200 flex items-center">
                  <FiSave className="mr-2 h-4 w-4" />
                  Settings updated successfully!
                </div>
              )}
              <Button
                variant="primary"
                icon={FiSave}
                onClick={handleSaveSettings}
                disabled={loading}
                isLoading={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name || 'User'}</h2>
              <p className="text-gray-600 mb-6">{user?.email || 'user@example.com'}</p>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  icon={FiEdit3}
                  className="w-full border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                  onClick={() => {/* Add profile edit functionality */}}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  icon={FiKey}
                  className="w-full border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                  onClick={() => {/* Add change password functionality */}}
                >
                  Change Password
                </Button>
              </div>

              {/* Account Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-sm text-gray-500">Projects</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">48</p>
                    <p className="text-sm text-gray-500">Tasks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Panels */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appearance Settings */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FiSun className="mr-3 h-6 w-6 text-yellow-500" />
                Appearance
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center">
                    {settings.darkMode ? (
                      <FiMoon className="mr-4 h-6 w-6 text-blue-600" />
                    ) : (
                      <FiSun className="mr-4 h-6 w-6 text-yellow-600" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Dark Mode</h3>
                      <p className="text-sm text-gray-600">Toggle between light and dark theme</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`${settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'} relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg`}
                    onClick={() => handleToggle('darkMode')}
                  >
                    <span
                      className={`${settings.darkMode ? 'translate-x-6' : 'translate-x-0'} inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FiBell className="mr-3 h-6 w-6 text-blue-500" />
                Notifications
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center">
                    <FiMail className="mr-4 h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`${settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'} relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg`}
                    onClick={() => handleToggle('emailNotifications')}
                  >
                    <span
                      className={`${settings.emailNotifications ? 'translate-x-6' : 'translate-x-0'} inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-center">
                    <FiSmartphone className="mr-4 h-6 w-6 text-purple-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
                      <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`${settings.pushNotifications ? 'bg-purple-600' : 'bg-gray-300'} relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg`}
                    onClick={() => handleToggle('pushNotifications')}
                  >
                    <span
                      className={`${settings.pushNotifications ? 'translate-x-6' : 'translate-x-0'} inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FiShield className="mr-3 h-6 w-6 text-green-500" />
                Security
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center">
                    <FiLock className="mr-4 h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`${settings.twoFactorAuth ? 'bg-green-600' : 'bg-gray-300'} relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg`}
                    onClick={() => handleToggle('twoFactorAuth')}
                  >
                    <span
                      className={`${settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-0'} inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>

                {/* Additional Security Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    icon={FiKey}
                    className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600"
                    onClick={() => {/* Add change password functionality */}}
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    icon={FiEye}
                    className="border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-600"
                    onClick={() => {/* Add login activity functionality */}}
                  >
                    Login Activity
                  </Button>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FiGlobe className="mr-3 h-6 w-6 text-indigo-500" />
                Privacy & Data
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Usage</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your data is stored securely and used only to provide our services. We never share your personal information with third parties.
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="text-xs border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
                      onClick={() => {/* Add export data functionality */}}
                    >
                      Export Data
                    </Button>
                    <Button
                      variant="outline"
                      className="text-xs border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600"
                      onClick={() => {/* Add delete account functionality */}}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}