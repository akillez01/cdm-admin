import React from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginForm from './auth/LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, login, error } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Desabilitar Google temporariamente até configurar no Supabase
    return <LoginForm onLogin={login} onGoogleLogin={undefined} isLoading={isLoading} error={error || undefined} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
