'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateProfile } from '../../redux/slices/authSlice';
import { DashboardLayout } from '../../components/layout';
import { Button, Card } from '../../components/common';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string(),
  jobTitle: Yup.string(),
  department: Yup.string(),
});

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(updateProfile(values));
      setUpdateSuccess(true);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <div className="flex flex-col items-center p-4">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <FiUser className="w-16 h-16 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.jobTitle || 'No job title'}</p>
                <p className="text-gray-500">{user.department || 'No department'}</p>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              {updateSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                  Profile updated successfully!
                </div>
              )}
              <Formik
                initialValues={{
                  name: user.name || '',
                  email: user.email || '',
                  phone: user.phone || '',
                  jobTitle: user.jobTitle || '',
                  department: user.department || '',
                }}
                validationSchema={ProfileSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-gray-400" />
                        </div>
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="text-gray-400" />
                        </div>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone className="text-gray-400" />
                        </div>
                        <Field
                          type="text"
                          name="phone"
                          id="phone"
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                        Job Title
                      </label>
                      <Field
                        type="text"
                        name="jobTitle"
                        id="jobTitle"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                        Department
                      </label>
                      <Field
                        type="text"
                        name="department"
                        id="department"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        icon={FiSave}
                        disabled={isSubmitting || loading}
                        isLoading={isSubmitting || loading}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}