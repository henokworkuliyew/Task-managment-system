'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getCurrentUser } from '../../redux/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isHydrated, setIsHydrated] = useState(false);

  // Fix hydration mismatch by ensuring client-side rendering
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated && !loading) {
      // Try to get current user if we have a token but not authenticated yet
      dispatch(getCurrentUser())
        .unwrap()
        .catch(() => {
          // If getting current user fails, redirect to login
          router.push('/auth/login');
        });
    }
  }, [isHydrated, isAuthenticated, loading, dispatch, router]);

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If authenticated, render children
  return isAuthenticated ? <>{children}</> : null;
}