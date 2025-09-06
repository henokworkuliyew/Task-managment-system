'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../redux/hooks';
import { forgotPassword } from '../../redux/slices/authSlice';

interface ForgotPasswordFormValues {
  email: string;
}

const initialValues: ForgotPasswordFormValues = {
  email: '',
};

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

export default function ForgotPasswordForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const resultAction = await dispatch(forgotPassword(values.email));
      
      if (forgotPassword.fulfilled.match(resultAction)) {
        toast.success('Password reset instructions have been sent to your email.');
        router.push('/auth/verify-otp');
      } else if (forgotPassword.rejected.match(resultAction)) {
        toast.error(resultAction.payload as string || 'Failed to process your request. Please try again.');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
        Forgot Password
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your email address and we&apos;ll send you instructions to reset
        your password.
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting: formikSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || formikSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/auth/login')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Back to Login
                </button>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}