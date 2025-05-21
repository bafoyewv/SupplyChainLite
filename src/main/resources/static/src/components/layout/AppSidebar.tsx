
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Store, 
  BarChart4, 
  Settings,
  LogOut,
  User,
  LayoutDashboard
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent,
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarHeader
} from '@/components/ui/sidebar';

const AppSidebar: React.FC = () => {
  const { user, logout, isRole } = useAuth();
  const location = useLocation();

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        title: 'Dashboard',
        icon: LayoutDashboard,
        url: `/${user?.role.toLowerCase()}/dashboard`,
      },
    ];

    const adminItems = [
      {
        title: 'Users',
        icon: Users,
        url: '/admin/users',
      },
      {
        title: 'Inventory',
        icon: Package,
        url: '/inventory',
      },
      {
        title: 'Orders',
        icon: ShoppingCart,
        url: '/orders',
      },
      {
        title: 'Suppliers',
        icon: Store,
        url: '/suppliers',
      },
      {
        title: 'Reports',
        icon: BarChart4,
        url: '/reports',
      },
      {
        title: 'Settings',
        icon: Settings,
        url: '/settings',
      },
    ];

    const userItems = [
      {
        title: 'Orders',
        icon: ShoppingCart,
        url: '/orders',
      },
      {
        title: 'Products',
        icon: Package,
        url: '/inventory',
      },
    ];

    const supplierItems = [
      {
        title: 'Orders',
        icon: ShoppingCart,
        url: '/orders',
      },
      {
        title: 'Inventory',
        icon: Package,
        url: '/inventory',
      },
      {
        title: 'Reports',
        icon: BarChart4,
        url: '/reports',
      },
    ];

    if (isRole('ADMIN')) {
      return [...baseItems, ...adminItems];
    } else if (isRole('USER')) {
      return [...baseItems, ...userItems];
    } else if (isRole('SUPPLIER')) {
      return [...baseItems, ...supplierItems];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4">
        <Link to="/" className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-purple-600" />
          <span className="text-xl font-bold">SupplyChainLite</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      location.pathname === item.url && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 text-purple-500 p-2 rounded-full">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
