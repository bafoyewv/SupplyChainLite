
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { UserRole } from '@/utils/permissions';

type User = {
  id: number;
  username: string;
  email: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string, role?: UserRole) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Set authorization header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // In a real app, you would connect to your backend
      // For demo purposes, we'll simulate a successful login
      // This is a mock implementation - replace with actual API call when backend is ready
      console.log("Attempting login with:", email, password);
      
      // Determine role based on email pattern (for demonstration)
      let role: UserRole = 'USER';
      if (email.includes('admin')) {
        role = 'ADMIN';
      } else if (email.includes('supplier')) {
        role = 'SUPPLIER';
      }
      
      // Simulate successful login with mock data
      const mockUser = {
        id: 1,
        username: email.split('@')[0],
        email: email,
        role: role
      };
      
      const mockToken = "mock-jwt-token-" + Date.now();
      
      setUser(mockUser);
      setToken(mockToken);
      
      // Store in localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Set authorization header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      
      console.log("Login successful, user set:", mockUser);
      toast.success(`Successfully logged in as ${role}`);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, role: UserRole = 'USER') => {
    try {
      setIsLoading(true);
      // In a real app, you would connect to your backend
      // For demo, we'll simulate a successful registration
      console.log("Registration attempted with:", username, email, role);
      toast.success(`Successfully registered as ${role}. You can now log in.`);
      return Promise.resolve();
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Successfully logged out');
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
