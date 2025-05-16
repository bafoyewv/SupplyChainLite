
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const Suppliers = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Suppliers Management</h1>
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
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-12 text-center">
            <p className="text-muted-foreground">
              Supplier management functionality will be implemented here.
              <br />
              Coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Suppliers;
