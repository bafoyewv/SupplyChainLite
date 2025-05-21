
import React from 'react';
import { Package, ShoppingCart, Users, Store } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import RecentOrders from '../../components/dashboard/RecentOrders';
import InventoryStatus from '../../components/dashboard/InventoryStatus';
import SalesChart from '../../components/dashboard/SalesChart';
import { InventoryItem, InventoryStatus as InvStatus } from '../../types/inventory';
import { Order, OrderStatus, PaymentStatus } from '../../types/order';

// Mock data for the dashboard
const mockOrders: Order[] = [
  {
    id: '1a2b3c4d',
    customerName: 'John Doe',
    items: [{ productId: 'prod1', quantity: 2, price: 29.99 }],
    totalAmount: 59.98,
    status: 'COMPLETED' as OrderStatus,
    paymentStatus: 'PAID' as PaymentStatus,
    createdAt: '2023-05-15T10:30:00Z',
  },
  {
    id: '2b3c4d5e',
    customerName: 'Jane Smith',
    items: [{ productId: 'prod2', quantity: 1, price: 49.99 }],
    totalAmount: 49.99,
    status: 'PROCESSING' as OrderStatus,
    paymentStatus: 'PAID' as PaymentStatus,
    createdAt: '2023-05-16T09:15:00Z',
  },
  {
    id: '3c4d5e6f',
    customerName: 'Bob Johnson',
    items: [{ productId: 'prod3', quantity: 3, price: 19.99 }],
    totalAmount: 59.97,
    status: 'PENDING' as OrderStatus,
    paymentStatus: 'UNPAID' as PaymentStatus,
    createdAt: '2023-05-16T14:45:00Z',
  },
  {
    id: '4d5e6f7g',
    customerName: 'Alice Brown',
    items: [{ productId: 'prod4', quantity: 1, price: 99.99 }],
    totalAmount: 99.99,
    status: 'CANCELLED' as OrderStatus,
    paymentStatus: 'FAILED' as PaymentStatus,
    createdAt: '2023-05-14T11:20:00Z',
  },
];

const mockInventory: InventoryItem[] = [
  {
    id: 'prod1',
    name: 'Premium Headphones',
    quantity: 25,
    category: 'Electronics',
    price: 29.99,
    status: 'IN_STOCK' as InvStatus,
  },
  {
    id: 'prod2',
    name: 'Ergonomic Keyboard',
    quantity: 5,
    category: 'Electronics',
    price: 49.99,
    status: 'LOW_STOCK' as InvStatus,
  },
  {
    id: 'prod3',
    name: 'Wireless Mouse',
    quantity: 0,
    category: 'Electronics',
    price: 19.99,
    status: 'OUT_OF_STOCK' as InvStatus,
  },
  {
    id: 'prod4',
    name: 'Ultra HD Monitor',
    quantity: 12,
    category: 'Electronics',
    price: 99.99,
    status: 'IN_STOCK' as InvStatus,
  },
];

const salesData = [
  { name: 'Jan', value: 1000 },
  { name: 'Feb', value: 1200 },
  { name: 'Mar', value: 900 },
  { name: 'Apr', value: 1500 },
  { name: 'May', value: 2000 },
  { name: 'Jun', value: 1800 },
  { name: 'Jul', value: 2200 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the SupplyChainLite Admin Dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value="1,234"
          description="Last 30 days"
          icon={<ShoppingCart size={24} />}
          trend="up"
          trendValue="12% from previous month"
        />
        <StatCard
          title="Total Inventory"
          value="432"
          description="Across all categories"
          icon={<Package size={24} />}
          trend="neutral"
          trendValue="Same as previous month"
        />
        <StatCard
          title="Active Users"
          value="87"
          description="Store owners, staff & suppliers"
          icon={<Users size={24} />}
          trend="up"
          trendValue="5% from previous month"
        />
        <StatCard
          title="Suppliers"
          value="24"
          description="Active suppliers"
          icon={<Store size={24} />}
          trend="down"
          trendValue="2% from previous month"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <SalesChart data={salesData} />
        <div className="space-y-6">
          <InventoryStatus items={mockInventory} />
        </div>
      </div>

      <RecentOrders orders={mockOrders} />
    </div>
  );
};

export default AdminDashboard;
