
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InventoryItem } from '@/types/inventory';

const mockItems: InventoryItem[] = [
  {
    id: 'prod1',
    name: 'Premium Headphones',
    quantity: 25,
    category: 'Electronics',
    price: 29.99,
    status: 'IN_STOCK',
  },
  {
    id: 'prod2',
    name: 'Ergonomic Keyboard',
    quantity: 5,
    category: 'Electronics',
    price: 49.99,
    status: 'LOW_STOCK',
  },
  {
    id: 'prod3',
    name: 'Wireless Mouse',
    quantity: 0,
    category: 'Electronics',
    price: 19.99,
    status: 'OUT_OF_STOCK',
  },
  {
    id: 'prod4',
    name: 'Office Chair',
    quantity: 12,
    category: 'Furniture',
    price: 149.99,
    status: 'IN_STOCK',
  },
];

const Inventory: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage all products in inventory</p>
        </div>
        <Button>Add Product</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            A list of all products in the inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Badge variant={
                      item.status === 'IN_STOCK' 
                        ? 'default'
                        : item.status === 'LOW_STOCK'
                        ? 'outline'
                        : 'destructive'
                    }>
                      {item.status === 'IN_STOCK' 
                        ? 'In Stock'
                        : item.status === 'LOW_STOCK'
                        ? 'Low Stock'
                        : 'Out of Stock'
                      }
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Restock</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
