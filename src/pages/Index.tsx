import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { user, loading, primaryRole } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const routes: Record<string, string> = {
    super_admin: '/admin',
    gym_owner: '/owner',
    trainer: '/trainer',
    member: '/member',
  };

  return <Navigate to={primaryRole ? routes[primaryRole] : '/login'} replace />;
};

export default Index;
