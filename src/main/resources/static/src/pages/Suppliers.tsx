
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, Edit, Trash2, Search } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';
import { toast } from 'sonner';

const Suppliers = () => {
  const { can } = usePermission();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock suppliers data with useState to enable CRUD operations
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'TechSupplies Inc.', contact: 'John Smith', email: 'john@techsupplies.com', phone: '123-456-7890', products: 24 },
    { id: 2, name: 'Electronics Hub', contact: 'Sarah Johnson', email: 'sarah@electhub.com', phone: '987-654-3210', products: 38 },
    { id: 3, name: 'Office Solutions', contact: 'Mike Brown', email: 'mike@officesolutions.com', phone: '555-123-4567', products: 15 },
    { id: 4, name: 'Global Imports', contact: 'Lisa Chen', email: 'lisa@globalimports.com', phone: '444-333-2222', products: 42 },
    { id: 5, name: 'Quality Parts Ltd', contact: 'Robert Taylor', email: 'robert@qualityparts.com', phone: '777-888-9999', products: 19 }
  ]);
  
  // Delete supplier handler
  const handleDelete = (id: number) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    toast.success("Supplier deleted successfully");
  };
  
  // Edit supplier handler (just a toast for now)
  const handleEdit = (id: number) => {
    toast.info(`Editing supplier with ID: ${id}`);
  };
  
  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new supplier handler (just a toast for now)
  const handleAddSupplier = () => {
    toast.info("Opening new supplier form");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Suppliers Management</h1>
        {can('supplier:create') && (
          <Button onClick={handleAddSupplier}>
            <Plus className="mr-2 h-4 w-4" /> New Supplier
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Suppliers Overview
          </CardTitle>
          <CardDescription>
            Manage your supplier relationships and information
          </CardDescription>
          <div className="mt-2">
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
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
                <TableHead>Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No suppliers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map(supplier => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.products}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {can('supplier:edit') && (
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(supplier.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {can('supplier:delete') && (
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(supplier.id)}>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Suppliers;
