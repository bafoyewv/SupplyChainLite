
// Define the available roles in the system
export type UserRole = 'ADMIN' | 'USER' | 'SUPPLIER';

// Define all possible permissions in the application
export type Permission = 
  | 'product:create' 
  | 'product:edit' 
  | 'product:delete'
  | 'inventory:view'
  | 'inventory:edit'
  | 'order:view'
  | 'order:create'
  | 'order:edit'
  | 'supplier:create'
  | 'supplier:edit'
  | 'supplier:delete'
  | 'user:manage'
  | 'dashboard:view'
  | 'profile:view'
  | 'profile:edit'
  | 'admin';  // Added 'admin' permission

// Define the permission matrix based on role
export const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: [
    'product:create', 'product:edit', 'product:delete',
    'inventory:view', 'inventory:edit',
    'order:view', 'order:create', 'order:edit',
    'supplier:create', 'supplier:edit', 'supplier:delete',
    'user:manage',
    'dashboard:view',
    'profile:view', 'profile:edit',
    'admin'  // Added 'admin' permission for ADMIN role
  ],
  USER: [
    'inventory:view', 'inventory:edit',
    'order:view', 'order:create', 'order:edit',
    'dashboard:view',
    'profile:view', 'profile:edit'
  ],
  SUPPLIER: [
    'product:create', 'product:edit', 'product:delete',
    'order:view', 'order:create', 'order:edit',
    'profile:view', 'profile:edit'
  ]
};

// Helper function to check if a user has a specific permission
export const hasPermission = (role: UserRole | undefined, permission: Permission): boolean => {
  if (!role) return false;
  return rolePermissions[role].includes(permission);
};

// Helper function to check if a user has any of the permissions
export const hasAnyPermission = (role: UserRole | undefined, permissions: Permission[]): boolean => {
  if (!role) return false;
  return permissions.some(permission => rolePermissions[role].includes(permission));
};

// Helper function to check if a user has all of the permissions
export const hasAllPermissions = (role: UserRole | undefined, permissions: Permission[]): boolean => {
  if (!role) return false;
  return permissions.every(permission => rolePermissions[role].includes(permission));
};
