
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, UserRole, AuthState } from '../types/auth';
import { authApi } from '../api/auth';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  isRole: (roles: UserRole | UserRole[]) => boolean;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        setAuthState({
          isAuthenticated: true,
          user,
          token,
        });
      } catch (error) {
        console.error('Failed to parse auth user', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    // If authenticated, fetch fresh user data
    if (authState.isAuthenticated && authState.user) {
      authApi.getProfile()
        .then(updatedUser => {
          updateUser(updatedUser);
        })
        .catch(error => {
          console.error('Error fetching user profile', error);
          // Only logout if it's an auth error
          if (error.response?.status === 401) {
            logout();
          }
        });
    }
  }, [authState.isAuthenticated]);

  const login = (token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    setAuthState({
      isAuthenticated: true,
      user,
      token,
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  const isRole = (roles: UserRole | UserRole[]): boolean => {
    if (!authState.user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(authState.user.role);
    }
    
    return authState.user.role === roles;
  };

  const updateUser = (user: User) => {
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    setAuthState(prev => ({
      ...prev,
      user,
    }));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        isRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
