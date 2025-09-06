'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateSettings } from "../../redux/slices/authSlice"
import { DashboardLayout } from '../../components/layout';
import { Button, Card } from '../../components/common';
import { FiSave, FiMoon, FiSun, FiBell, FiLock } from 'react-icons/fi';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    darkMode: user?.settings?.darkMode || false,
    emailNotifications: user?.settings?.emailNotifications || true,
    pushNotifications: user?.settings?.pushNotifications || true,
    twoFactorAuth: user?.settings?.twoFactorAuth || false,
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

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {settings.darkMode ? (
                    <FiMoon className="mr-3 text-gray-600" />
                  ) : (
                    <FiSun className="mr-3 text-gray-600" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Dark Mode</h3>
                    <p className="text-sm text-gray-500">Toggle between light and dark theme</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    className={`${settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    onClick={() => handleToggle('darkMode')}
                  >
                    <span
                      className={`${settings.darkMode ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiBell className="mr-3 text-gray-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    className={`${settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    onClick={() => handleToggle('emailNotifications')}
                  >
                    <span
                      className={`${settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiBell className="mr-3 text-gray-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    className={`${settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    onClick={() => handleToggle('pushNotifications')}
                  >
                    <span
                      className={`${settings.pushNotifications ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Security</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiLock className="mr-3 text-gray-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    className={`${settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    onClick={() => handleToggle('twoFactorAuth')}
                  >
                    <span
                      className={`${settings.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end mt-4">
            {updateSuccess && (
              <div className="mr-4 p-2 bg-green-100 text-green-700 rounded">
                Settings updated successfully!
              </div>
            )}
            <Button
              variant="primary"
              icon={FiSave}
              onClick={handleSaveSettings}
              disabled={loading}
              isLoading={loading}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}