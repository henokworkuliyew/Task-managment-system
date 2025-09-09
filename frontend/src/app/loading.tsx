'use client';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Task Management System</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
