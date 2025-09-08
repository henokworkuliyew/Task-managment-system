'use client';

import { ProjectForm } from '../../../components/projects';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/projects');
    }, 100);
  };

  const handleCancel = () => {
    router.push('/projects');
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl mb-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 bg-clip-text text-transparent mb-2">
            Launch Your Project
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-teal-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-emerald-700 max-w-3xl mx-auto font-medium leading-relaxed">
            🚀 Transform your vision into reality. Build something amazing with clear objectives, smart planning, and seamless team collaboration.
          </p>
        </div>
        
        {/* Form Container */}
        <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl shadow-2xl border-2 border-emerald-200/50 overflow-hidden backdrop-blur-sm">
          <div className="bg-gradient-to-r from-emerald-500/20 via-green-500/15 to-teal-500/20 px-10 py-8 border-b-2 border-emerald-200/30">
            <div className="flex items-center space-x-4">
              <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-emerald-800">Project Blueprint</h2>
            </div>
            <p className="text-emerald-700 mt-2 text-lg">Define your project&apos;s foundation with precision and clarity</p>
          </div>
          
          <div className="p-8">
            <ProjectForm 
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
