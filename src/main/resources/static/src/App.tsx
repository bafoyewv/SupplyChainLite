
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Suppliers from "./pages/Suppliers";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import OrderProducts from "./pages/OrderProducts";
import Payment from "./pages/Payment";

// Initialize axios with default settings
import './services/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes with AppLayout */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredPermissions={['dashboard:view']}>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/products" element={
              <ProtectedRoute requiredPermissions={['product:create', 'product:edit']}>
                <AppLayout>
                  <Products />
                </AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/inventory" element={
              <ProtectedRoute requiredPermissions={['inventory:view']}>
                <AppLayout>
                  <Inventory />
                </AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/orders" element={
              <ProtectedRoute requiredPermissions={['order:view']}>
                <AppLayout>
                  <Orders />
                </AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/suppliers" element={
              <ProtectedRoute requiredPermissions={['supplier:create', 'supplier:edit']}>
                <AppLayout>
                  <Suppliers />
                </AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/users" element={
              <ProtectedRoute requiredPermissions={['user:manage']}>
                <AppLayout>
                  <Users />
                </AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/settings" element={
              <ProtectedRoute requiredPermissions={['admin']}>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute requiredPermissions={['profile:view']}>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* New routes for order products and payment */}
            <Route path="/order-products" element={
              <ProtectedRoute>
                <AppLayout>
                  <OrderProducts />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/payment" element={
              <ProtectedRoute>
                <AppLayout>
                  <Payment />
                </AppLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
