
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mx-auto max-w-md text-center">
        <AlertTriangle className="mx-auto mb-6 h-16 w-16 text-amber-500" />
        <h1 className="mb-4 text-3xl font-bold">Access Denied</h1>
        <p className="mb-6 text-gray-600">
          You don't have permission to access this page. Your current role is{' '}
          <span className="font-semibold">{user?.role || 'Unknown'}</span>. Please contact your administrator if you
          believe this is a mistake.
        </p>
        <Button asChild>
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
