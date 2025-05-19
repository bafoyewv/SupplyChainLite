
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePermission } from '@/hooks/usePermission';
import { Package, Search, Plus, Edit } from 'lucide-react';

const Inventory = () => {
  const { can } = usePermission();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock inventory data
  const inventoryItems = [
    { id: 1, product: 'Laptop', sku: 'LAP-001', stock: 15, min_stock: 5, location: 'Warehouse A', status: 'In Stock' },
    { id: 2, product: 'Smartphone', sku: 'PH-002', stock: 25, min_stock: 10, location: 'Warehouse B', status: 'In Stock' },
    { id: 3, product: 'Tablet', sku: 'TAB-003', stock: 8, min_stock: 10, location: 'Warehouse A', status: 'Low Stock' },
    { id: 4, product: 'Monitor', sku: 'MON-004', stock: 20, min_stock: 8, location: 'Warehouse C', status: 'In Stock' },
    { id: 5, product: 'Keyboard', sku: 'KB-005', stock: 30, min_stock: 15, location: 'Warehouse B', status: 'In Stock' },
    { id: 6, product: 'Mouse', sku: 'MS-006', stock: 4, min_stock: 5, location: 'Warehouse B', status: 'Low Stock' },
  ];

  // Filter inventory items based on search term
  const filteredItems = inventoryItems.filter(item => 
    item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        {can('inventory:edit') && (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Stock
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Inventory Overview
          </CardTitle>
          <CardDescription>
            Manage your inventory levels and monitor stock movements
          </CardDescription>
          <div className="mt-2">
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No inventory items found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>{item.min_stock}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.status === 'In Stock' ? 'bg-green-100 text-green-800' : 
                        item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {can('inventory:edit') && (
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
