import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Order, OrderStatus, PaymentStatus } from '@/types/order';
import OrderPayment from '@/components/order/OrderPayment';

const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    date: '2023-05-15',
    items: [
      { productId: 'PROD-1', name: 'Laptop', quantity: 1, price: 599.99 },
      { productId: 'PROD-2', name: 'Mouse', quantity: 1, price: 29.99 },
      { productId: 'PROD-3', name: 'Keyboard', quantity: 1, price: 59.99 }
    ],
    totalAmount: 689.97,
    status: 'COMPLETED' as OrderStatus,
    paymentStatus: 'PAID' as PaymentStatus,
    createdAt: '2023-05-15T10:30:00Z'
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    date: '2023-05-16',
    items: [
      { productId: 'PROD-4', name: 'Monitor', quantity: 1, price: 249.99 }
    ],
    totalAmount: 249.99,
    status: 'PROCESSING' as OrderStatus,
    paymentStatus: 'PAID' as PaymentStatus,
    createdAt: '2023-05-16T14:20:00Z'
  },
  {
    id: 'ORD-003',
    customerName: 'Bob Johnson',
    date: '2023-05-16',
    items: [
      { productId: 'PROD-5', name: 'Headphones', quantity: 2, price: 49.99 },
      { productId: 'PROD-6', name: 'USB Cable', quantity: 3, price: 9.99 }
    ],
    totalAmount: 129.95,
    status: 'PENDING' as OrderStatus,
    paymentStatus: 'UNPAID' as PaymentStatus,
    createdAt: '2023-05-16T16:40:00Z'
  },
  {
    id: 'ORD-004',
    customerName: 'Alice Brown',
    date: '2023-05-17',
    items: [
      { productId: 'PROD-7', name: 'Webcam', quantity: 1, price: 39.99 },
      { productId: 'PROD-8', name: 'Microphone', quantity: 1, price: 19.99 }
    ],
    totalAmount: 59.98,
    status: 'COMPLETED' as OrderStatus,
    paymentStatus: 'PAID' as PaymentStatus,
    createdAt: '2023-05-17T09:15:00Z'
  },
];

const Orders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handlePayNow = (order: Order) => {
    setSelectedOrder(order);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    // In a real application, we would update the order status in the database
    setIsPaymentOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
        <Button>Create Order</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            A list of all customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'COMPLETED' 
                        ? 'default'
                        : order.status === 'PROCESSING' 
                        ? 'secondary'
                        : 'destructive'
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      order.paymentStatus === 'PAID' 
                        ? 'default'
                        : order.paymentStatus === 'PROCESSING' 
                        ? 'secondary'
                        : 'destructive'
                    }>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm">View</Button>
                    {order.paymentStatus === 'UNPAID' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePayNow(order)}
                      >
                        Pay Now
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedOrder && (
            <OrderPayment 
              order={selectedOrder} 
              onClose={() => setIsPaymentOpen(false)}
              onSuccess={handlePaymentSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
