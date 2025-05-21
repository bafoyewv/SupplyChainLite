
import React from 'react';
import { ShoppingCart, Package, CheckCircle } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import RecentOrders from '../../components/dashboard/RecentOrders';
import { Order, OrderStatus, PaymentStatus } from '../../types/order';

// Mock data for the staff dashboard
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
    paymentStatus: 'PROCESSING' as PaymentStatus,
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
];

const StaffDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Staff Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the SupplyChainLite Staff Dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="New Orders"
          value="12"
          description="Today"
          icon={<ShoppingCart size={24} />}
          trend="up"
          trendValue="3 more than yesterday"
        />
        <StatCard
          title="Processing Orders"
          value="8"
          description="Currently in progress"
          icon={<Package size={24} />}
          trend="neutral"
          trendValue="Same as yesterday"
        />
        <StatCard
          title="Completed Orders"
          value="5"
          description="Today"
          icon={<CheckCircle size={24} />}
          trend="down"
          trendValue="2 less than yesterday"
        />
      </div>

      <RecentOrders orders={mockOrders} />

      <div className="stack-card">
        <h2 className="text-lg font-medium mb-4">Inventory Check Tasks</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Check Electronics Stock</p>
                <p className="text-sm text-muted-foreground">Due today</p>
              </div>
            </div>
            <button className="text-sm text-primary hover:underline">Start</button>
          </div>
          <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 text-purple-700 p-2 rounded-full">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Update Office Supplies Inventory</p>
                <p className="text-sm text-muted-foreground">Due tomorrow</p>
              </div>
            </div>
            <button className="text-sm text-primary hover:underline">Start</button>
          </div>
          <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-700 p-2 rounded-full">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Verify Received Shipment</p>
                <p className="text-sm text-muted-foreground">Due today</p>
              </div>
            </div>
            <button className="text-sm text-primary hover:underline">Start</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
