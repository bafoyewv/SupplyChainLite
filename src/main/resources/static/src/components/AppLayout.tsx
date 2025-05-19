import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Package, 
  ShoppingCart, 
  Users, 
  Box, 
  Settings, 
  LogOut, 
  Menu,
  User,
  Database
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, to, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
      active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/80'
    }`}
  >
    <span className="w-5 h-5">{icon}</span>
    <span>{text}</span>
  </Link>
);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { can } = usePermission();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { 
      icon: <BarChart size={20} />, 
      text: 'Dashboard', 
      to: '/dashboard',
      permission: 'dashboard:view' 
    },
    { 
      icon: <Package size={20} />, 
      text: 'Products', 
      to: '/products',
      permission: 'product:create' 
    },
    { 
      icon: <Box size={20} />, 
      text: 'Inventory', 
      to: '/inventory',
      permission: 'inventory:view' 
    },
    { 
      icon: <ShoppingCart size={20} />, 
      text: 'Orders', 
      to: '/orders',
      permission: 'order:view' 
    },
    { 
      icon: <Users size={20} />, 
      text: 'Suppliers', 
      to: '/suppliers',
      permission: 'supplier:create'
    },
    {
      icon: <Users size={20} />, 
      text: 'Users', 
      to: '/users',
      permission: 'user:manage'
    },
    {
      icon: <Settings size={20} />, 
      text: 'Settings', 
      to: '/settings',
      permission: 'admin'
    }
  ];

  // Filter navigation items based on user permissions
  const authorizedNavItems = navItems.filter(item => 
    can(item.permission as any)
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex h-full flex-col bg-sidebar transition-all duration-300 ease-in-out lg:static ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-sidebar-foreground">SupplyChainLite</h1>
          ) : (
            <h1 className="text-xl font-bold text-sidebar-foreground">SCL</h1>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {authorizedNavItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              text={sidebarOpen ? item.text : ''}
              to={item.to}
              active={pathname === item.to}
              onClick={() => setSidebarOpen(true)}
            />
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-3">
          <Link
            to="/profile"
            className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
              pathname === '/profile'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/80'
            }`}
          >
            <User size={20} />
            {sidebarOpen && <span>Profile</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent/80"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>

          <div className="flex items-center gap-4">
            <span className="hidden md:block">
              Welcome, {user?.username || 'User'} ({user?.role})
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
