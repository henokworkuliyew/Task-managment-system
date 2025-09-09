import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
  variant?: 'card' | 'list' | 'table';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = '', 
  rows = 3,
  variant = 'card'
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  if (variant === 'card') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
            <div className={`${baseClasses} h-6 w-3/4`}></div>
            <div className={`${baseClasses} h-4 w-full`}></div>
            <div className={`${baseClasses} h-4 w-2/3`}></div>
            <div className="flex space-x-2">
              <div className={`${baseClasses} h-8 w-20`}></div>
              <div className={`${baseClasses} h-8 w-16`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4">
            <div className={`${baseClasses} h-10 w-10 rounded-full`}></div>
            <div className="flex-1 space-y-2">
              <div className={`${baseClasses} h-4 w-3/4`}></div>
              <div className={`${baseClasses} h-3 w-1/2`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className={`${baseClasses} h-4 w-full`}></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
