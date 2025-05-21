
import React from 'react';
import { Package, ShoppingCart, TrendingUp } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import RecentOrders from '../../components/dashboard/RecentOrders';
import InventoryStatus from '../../components/dashboard/InventoryStatus';
import { InventoryItem, InventoryStatus as InvStatus } from '../../types/inventory';
import { Order, OrderStatus, PaymentStatus } from '../../types/order';

// Mock data for the supplier dashboard
const mockOrders: Order[] = [
  {
    id: '1a2b3c4d',
    customerName: 'Tech Store Inc.',
    items: [{ productId: 'prod1', quantity: 20, price: 25.99 }],
    totalAmount: 519.80,
    status: 'COMPLETED' as OrderStatus,
    paymentStatus: 'PAID' as PaymentStatus,
    createdAt: '2023-05-15T10:30:00Z',
  },
  {
    id: '2b3c4d5e',
    customerName: 'Gadget World',
    items: [{ productId: 'prod2', quantity: 10, price: 45.99 }],
    totalAmount: 459.90,
    status: 'PROCESSING' as OrderStatus,
    paymentStatus: 'PROCESSING' as PaymentStatus,
    createdAt: '2023-05-16T09:15:00Z',
  },
  {
    id: '3c4d5e6f',
    customerName: 'Electronics Hub',
    items: [{ productId: 'prod3', quantity: 30, price: 18.99 }],
    totalAmount: 569.70,
    status: 'PENDING' as OrderStatus,
    paymentStatus: 'UNPAID' as PaymentStatus,
    createdAt: '2023-05-16T14:45:00Z',
  },
];

const mockInventory: InventoryItem[] = [
  {
    id: 'prod1',
    name: 'Headphones (Wholesale)',
    quantity: 250,
    category: 'Electronics',
    price: 25.99,
    status: 'IN_STOCK' as InvStatus,
  },
  {
    id: 'prod2',
    name: 'Keyboards (Wholesale)',
    quantity: 50,
    category: 'Electronics',
    price: 45.99,
    status: 'LOW_STOCK' as InvStatus,
  },
  {
    id: 'prod3',
    name: 'Mice (Wholesale)',
    quantity: 300,
    category: 'Electronics',
    price: 18.99,
    status: 'IN_STOCK' as InvStatus,
  },
];

const SupplierDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Supplier Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the SupplyChainLite Supplier Dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Active Orders"
          value="8"
          description="From customers"
          icon={<ShoppingCart size={24} />}
          trend="up"
          trendValue="2 more than last week"
        />
        <StatCard
          title="Revenue"
          value="$9,245"
          description="Last 30 days"
          icon={<TrendingUp size={24} />}
          trend="up"
          trendValue="12% from previous month"
        />
        <StatCard
          title="Products Available"
          value="15"
          description="Ready to ship"
          icon={<Package size={24} />}
          trend="neutral"
          trendValue="Same as last week"
        />
      </div>

      <RecentOrders orders={mockOrders} />

      <InventoryStatus items={mockInventory} />

      <div className="stack-card">
        <h2 className="text-lg font-medium mb-4">Supply Chain Status</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-700 p-2 rounded-full">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Production Status</p>
                <p className="text-sm text-muted-foreground">On schedule</p>
              </div>
            </div>
            <div className="bg-green-100 text-green-700 text-xs font-medium py-1 px-2 rounded">Healthy</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 text-yellow-700 p-2 rounded-full">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Shipping Status</p>
                <p className="text-sm text-muted-foreground">Minor delays</p>
              </div>
            </div>
            <div className="bg-yellow-100 text-yellow-700 text-xs font-medium py-1 px-2 rounded">Warning</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-700 p-2 rounded-full">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Inventory Status</p>
                <p className="text-sm text-muted-foreground">Adequate stock levels</p>
              </div>
            </div>
            <div className="bg-green-100 text-green-700 text-xs font-medium py-1 px-2 rounded">Healthy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
