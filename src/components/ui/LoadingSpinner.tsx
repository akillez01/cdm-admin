import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]'
  };

  return (
    <div 
      className={`animate-spin rounded-full ${sizeClasses[size]} border-t-transparent border-primary-500`}
      aria-label="Carregando"
    />
  );
};

export default LoadingSpinner;