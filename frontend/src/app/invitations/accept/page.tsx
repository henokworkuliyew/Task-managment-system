'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { FiCheck, FiX, FiMail, FiUsers, FiCalendar } from 'react-icons/fi';

interface InvitationDetails {
  email: string;
  projectName: string;
  projectDescription: string;
  inviterName: string;
  expiresAt: string;
}

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    // Verify invitation token
    fetch(`/api/v1/invitations/verify/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setInvitation(data);
        }
      })
      .catch(() => {
        setError('Failed to verify invitation');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    
    setAccepting(true);
    try {
      const response = await fetch(`/api/v1/invitations/accept?token=${token}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      const data = await response.json();
      
      if (data.requiresRegistration) {
        // Redirect to registration with invitation context
        router.push(`/auth/register?invitation=${token}&email=${encodeURIComponent(data.invitation.email)}`);
      } else if (data.success) {
        toast.success('Successfully joined the project!');
        router.push('/projects');
      } else {
        throw new Error(data.message || 'Failed to accept invitation');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to accept invitation';
      toast.error(errorMessage);
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`/api/v1/invitations/decline?token=${token}`, {
        method: 'GET',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Invitation declined');
        router.push('/');
      } else {
        throw new Error(data.message || 'Failed to decline invitation');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to decline invitation';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <FiX className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Invitation</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-8 py-12 text-center">
          <div className="mx-auto h-20 w-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
            <FiUsers className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Project Invitation</h1>
          <p className="text-emerald-100 text-lg">You&apos;ve been invited to join a project!</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {invitation && (
            <div className="space-y-6">
              {/* Project Details */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{invitation.projectName}</h2>
                {invitation.projectDescription && (
                  <p className="text-gray-600">You&apos;ll be able to collaborate on tasks, share files, and contribute to the project&apos;s success.</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <FiMail className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>Invited: {invitation.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiUsers className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>From: {invitation.inviterName}</span>
                  </div>
                  <div className="flex items-center text-gray-600 md:col-span-2">
                    <FiCalendar className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>Expires: {new Date(invitation.expiresAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What you&apos;ll get:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                    Access to project tasks and issues
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                    Collaborate with team members
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                    Track project progress and milestones
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                    Receive notifications and updates
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-8 rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-lg shadow-lg transition-all duration-200"
                >
                  {accepting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Accepting...
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-2 h-5 w-5" />
                      Accept Invitation
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleDecline}
                  disabled={accepting}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 px-8 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-lg border border-gray-300 transition-all duration-200"
                >
                  <FiX className="mr-2 h-5 w-5" />
                  Decline
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
