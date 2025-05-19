
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Orders = () => {
  const { can } = usePermission();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock orders data with useState for CRUD operations
  const [orders, setOrders] = useState([
    { id: 1, customer_name: 'Alice Brown', order_date: '2023-06-10', status: 'Delivered', total: 1200 },
    { id: 2, customer_name: 'Bob White', order_date: '2023-06-15', status: 'Processing', total: 450 },
    { id: 3, customer_name: 'Carol Davis', order_date: '2023-06-20', status: 'Pending', total: 800 },
    { id: 4, customer_name: 'David Johnson', order_date: '2023-06-25', status: 'Processing', total: 320 },
    { id: 5, customer_name: 'Emma Wilson', order_date: '2023-06-30', status: 'Delivered', total: 560 }
  ]);

  // Delete order handler
  const handleDelete = (id: number) => {
    setOrders(orders.filter(order => order.id !== id));
    toast.success("Order deleted successfully");
  };

  // View order details handler
  const handleViewDetails = (id: number) => {
    toast.info(`Viewing order details for Order #${id}`);
  };

  // Edit order handler
  const handleEdit = (id: number) => {
    toast.info(`Editing order with ID: ${id}`);
  };

  // Add new order handler
  const handleAddOrder = () => {
    toast.info("Opening new order form");
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(order.id).includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        {can('order:create') && (
          <Button onClick={handleAddOrder}>
            <Plus className="mr-2 h-4 w-4" /> New Order
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Orders Overview
          </CardTitle>
          <CardDescription>
            Track and manage customer orders and their statuses
          </CardDescription>
          <div className="mt-2">
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-b hover:bg-muted/50">
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.order_date}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewDetails(order.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {can('order:edit') && (
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(order.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {can('order:edit') && (
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(order.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
