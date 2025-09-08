'use client';

import { IssueForm } from '../../../components/issues';
import { useRouter } from 'next/navigation';

export default function NewIssuePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/issues');
  };

  const handleCancel = () => {
    router.push('/issues');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl mb-8 transform rotate-6 hover:rotate-0 transition-transform duration-300">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-red-600 via-pink-600 to-rose-700 bg-clip-text text-transparent mb-4">
            Report Issue
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-red-400 via-pink-400 to-rose-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto font-medium leading-relaxed">
            🚨 Help us identify and resolve problems quickly. Your detailed reports help improve the system for everyone.
          </p>
        </div>
        
        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500/10 via-pink-500/10 to-rose-500/10 px-8 py-6 border-b border-slate-200">
            <div className="flex items-center space-x-4">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-slate-800">Issue Details</h2>
            </div>
            <p className="text-slate-600 mt-2 text-lg">Provide comprehensive information to help us resolve the issue</p>
          </div>
          
          <div className="p-8 bg-white">
            <IssueForm 
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
