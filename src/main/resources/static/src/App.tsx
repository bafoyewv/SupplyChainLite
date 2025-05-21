
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import React from 'react';

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Settings from "./pages/settings/Settings";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import Orders from "./pages/orders/Orders";

// Supplier Pages
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import Inventory from "./pages/inventory/Inventory";
import Reports from "./pages/reports/Reports";
import Suppliers from "./pages/suppliers/Suppliers";

// Error Pages
import NotFound from "./pages/NotFound";

const App = () => {
  // Create a new QueryClient instance with React.useState to ensure it's created only once
  const [queryClient] = React.useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SidebarProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route path="/" element={<AppLayout />}>
                    {/* Admin Routes */}
                    <Route path="admin/dashboard" element={<AdminDashboard />} />
                    <Route path="admin/users" element={<Users />} />
                    
                    {/* User Routes */}
                    <Route path="user/dashboard" element={<UserDashboard />} />
                    
                    {/* Supplier Routes */}
                    <Route path="supplier/dashboard" element={<SupplierDashboard />} />
                    
                    {/* Common Routes */}
                    <Route path="orders" element={<Orders />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="suppliers" element={<Suppliers />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Redirect root to login */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  
                  {/* 404 Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SidebarProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
