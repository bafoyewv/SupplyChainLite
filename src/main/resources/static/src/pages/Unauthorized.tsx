
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mx-auto max-w-md text-center">
        <AlertTriangle className="mx-auto mb-6 h-16 w-16 text-amber-500" />
        <h1 className="mb-4 text-3xl font-bold">Access Denied</h1>
        <p className="mb-6 text-gray-600">
          You don't have permission to access this page. Your current role is{' '}
          <span className="font-semibold">{user?.role || 'Unknown'}</span>.
        </p>
        
        <div className="mb-6 rounded-lg bg-amber-50 p-4 text-left">
          <h2 className="mb-2 text-lg font-medium text-amber-700">Role Permissions</h2>
          {user?.role === 'ADMIN' && (
            <p className="text-amber-700">
              As an admin, you have full access to all areas of the system. If you're seeing this page, there might be a technical issue.
            </p>
          )}
          
          {user?.role === 'USER' && (
            <p className="text-amber-700">
              As a user, you have access to: inventory management, order management, and viewing your profile.
              You cannot access supplier management, user management, or product management.
            </p>
          )}
          
          {user?.role === 'SUPPLIER' && (
            <p className="text-amber-700">
              As a supplier, you have access to: product management, order management, and viewing your profile.
              You cannot access inventory management, user management, or view the dashboard.
            </p>
          )}
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
          <Button asChild>
            <Link to="/profile">Go to Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
