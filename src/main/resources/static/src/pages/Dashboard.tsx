
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Package, ShoppingCart, Users, AlertCircle } from 'lucide-react';

interface DashboardStat {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  change?: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  const orderStatusData = [
    { name: 'Pending', value: 12 },
    { name: 'Shipped', value: 19 },
    { name: 'Delivered', value: 25 },
    { name: 'Cancelled', value: 3 },
  ];

  const monthlyOrdersData = [
    { name: 'Jan', orders: 4 },
    { name: 'Feb', orders: 7 },
    { name: 'Mar', orders: 10 },
    { name: 'Apr', orders: 8 },
    { name: 'May', orders: 12 },
    { name: 'Jun', orders: 16 },
    { name: 'Jul', orders: 14 },
    { name: 'Aug', orders: 18 },
    { name: 'Sep', orders: 20 },
    { name: 'Oct', orders: 22 },
    { name: 'Nov', orders: 25 },
    { name: 'Dec', orders: 28 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch actual data from your API
        // const response = await axios.get('/api/v1/dashboard');
        // const data = response.data;
        
        // Using mock data for demonstration
        const mockStats: DashboardStat[] = [
          {
            title: 'Total Products',
            value: 154,
            icon: <Package className="h-8 w-8 text-primary" />,
            description: '+12 new products this month',
            change: 8.2,
          },
          {
            title: 'Active Orders',
            value: 32,
            icon: <ShoppingCart className="h-8 w-8 text-green-500" />,
            description: '+5 orders today',
            change: 12.5,
          },
          {
            title: 'Low Stock Items',
            value: 7,
            icon: <AlertCircle className="h-8 w-8 text-red-500" />,
            description: 'Requires immediate attention',
            change: -3.8,
          },
          {
            title: 'Suppliers',
            value: 23,
            icon: <Users className="h-8 w-8 text-blue-400" />,
            description: '2 new suppliers this month',
            change: 2.4,
          },
        ];

        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              {stat.change !== undefined && (
                <div 
                  className={`mt-1 text-xs ${
                    stat.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bar Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Orders</CardTitle>
            <CardDescription>Number of orders per month</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyOrdersData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#0066ff" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Distribution of orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your supply chain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New order #ORD-123456', time: '10 minutes ago', user: 'John Doe' },
              { action: 'Product "Widget Pro" is low in stock', time: '1 hour ago', user: 'System' },
              { action: 'Supplier invoice #INV-789 received', time: '3 hours ago', user: 'Jane Smith' },
              { action: 'Order #ORD-122345 marked as delivered', time: '5 hours ago', user: 'Michael Brown' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
                <div className="text-sm text-muted-foreground">{activity.user}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
