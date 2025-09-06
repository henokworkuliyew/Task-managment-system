'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { OtpVerificationForm } from '../../../components/auth';
import { useAppSelector } from '../../../redux/hooks';

export default function VerifyOtpPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
    
    if (!email) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router, email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">Task Management System</h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Verify OTP</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the verification code sent to your email
          </p>
        </div>
        {email && <OtpVerificationForm email={email} />}
        <div className="text-center">
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}