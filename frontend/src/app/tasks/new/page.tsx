'use client';

import { TaskForm } from '../../../components/tasks';
import { useRouter } from 'next/navigation';

export default function NewTaskPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/tasks');
  };

  const handleCancel = () => {
    router.push('/tasks');
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl mb-8 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 bg-clip-text text-transparent mb-2">
            Craft Your Task
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto font-medium leading-relaxed">
            ✨ Break down complexity into achievable steps. Create focused tasks with clear deadlines and measurable outcomes.
          </p>
        </div>
        
        {/* Form Container */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl border-2 border-indigo-200/50 overflow-hidden backdrop-blur-sm">
          <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-pink-500/20 px-10 py-8 border-b-2 border-indigo-200/30">
            <div className="flex items-center space-x-4">
              <div className="h-3 w-3 bg-indigo-500 rounded-full animate-bounce"></div>
              <h2 className="text-2xl font-bold text-indigo-800">Task Configuration</h2>
            </div>
            <p className="text-indigo-700 mt-2 text-lg">Structure your work with precision and purpose</p>
          </div>
          
          <div className="p-8">
            <TaskForm 
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
