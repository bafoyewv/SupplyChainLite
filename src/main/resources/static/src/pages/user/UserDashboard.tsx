
import React from 'react';
import { Package, ShoppingCart, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatCard from '../../components/dashboard/StatCard';

const UserDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the SupplyChainLite User Dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="My Orders"
          value="12"
          description="Total orders placed"
          icon={<ShoppingCart size={24} />}
          trend="up"
          trendValue="3 new this month"
        />
        <StatCard
          title="Pending Orders"
          value="3"
          description="Awaiting delivery"
          icon={<Clock size={24} />}
          trend="neutral"
          trendValue="Updated just now"
        />
        <StatCard
          title="Products Available"
          value="156"
          description="Browse catalog"
          icon={<Package size={24} />}
          trend="up"
          trendValue="24 new products"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your most recent orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Order #{1000 + index}</p>
                    <p className="text-sm text-muted-foreground">
                      {index === 1 ? 'Processing' : index === 2 ? 'Shipped' : 'Delivered'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">View All Orders</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center">
                <ShoppingCart className="h-6 w-6 mb-1" />
                <span>New Order</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Clock className="h-6 w-6 mb-1" />
                <span>Track Order</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Package className="h-6 w-6 mb-1" />
                <span>Browse Catalog</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Package className="h-6 w-6 mb-1" />
                <span>Support</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
