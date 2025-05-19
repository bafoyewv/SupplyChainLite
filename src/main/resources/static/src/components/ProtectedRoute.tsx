
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Permission } from '@/utils/permissions';
import { usePermission } from '@/hooks/usePermission';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: Permission[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [],
  requiredPermissions = []
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { canAll } = usePermission();
  const location = useLocation();
  
  useEffect(() => {
    console.log("Protected route check:", { 
      isAuthenticated, 
      isLoading, 
      user, 
      path: location.pathname,
      requiredRoles,
      requiredPermissions
    });
  }, [isAuthenticated, isLoading, user, location.pathname, requiredRoles, requiredPermissions]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role (if specified)
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    console.log("User doesn't have required role, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if user has required permissions (if specified)
  if (requiredPermissions.length > 0 && !canAll(requiredPermissions)) {
    console.log("User doesn't have required permissions, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("Access granted to protected route");
  return <>{children}</>;
};

export default ProtectedRoute;
