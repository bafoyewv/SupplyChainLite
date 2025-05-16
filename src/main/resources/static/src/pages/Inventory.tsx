
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

const Inventory = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
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
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-12 text-center">
            <p className="text-muted-foreground">
              Inventory management functionality will be implemented here.
              <br />
              Coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
