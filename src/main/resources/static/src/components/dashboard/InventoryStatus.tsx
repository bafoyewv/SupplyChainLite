
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InventoryItem } from '../../types/inventory';

interface InventoryStatusProps {
  items: InventoryItem[];
}

const InventoryStatus: React.FC<InventoryStatusProps> = ({ items }) => {
  // Function to get badge variant based on inventory status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">In Stock</Badge>;
      case 'LOW_STOCK':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Low Stock</Badge>;
      case 'OUT_OF_STOCK':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="stack-card overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Inventory Status</h2>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryStatus;
