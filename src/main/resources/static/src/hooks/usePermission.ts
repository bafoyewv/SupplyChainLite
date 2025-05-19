
import { useAuth } from '@/contexts/AuthContext';
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from '@/utils/permissions';

export function usePermission() {
  const { user } = useAuth();
  
  return {
    // Check if user has a specific permission
    can: (permission: Permission): boolean => hasPermission(user?.role, permission),
    
    // Check if user has any of the listed permissions
    canAny: (permissions: Permission[]): boolean => hasAnyPermission(user?.role, permissions),
    
    // Check if user has all of the listed permissions
    canAll: (permissions: Permission[]): boolean => hasAllPermissions(user?.role, permissions),
    
    // Get user role
    role: user?.role
  };
}
