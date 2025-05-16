
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plus, Edit, Trash2, Search } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  supplierId: number;
  supplierName: string;
  lowStockThreshold: number;
  category: string;
  createdAt: string;
}

interface Supplier {
  id: number;
  name: string;
}

const Products = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);

  // Form state for adding/editing product
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    supplierId: 0,
    lowStockThreshold: 10,
    category: '',
  });

  // Mock data for demonstration
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Laptop Pro',
      description: 'High-performance laptop with 16GB RAM and 512GB SSD',
      price: 1299.99,
      quantity: 25,
      supplierId: 1,
      supplierName: 'TechWorld',
      lowStockThreshold: 10,
      category: 'Electronics',
      createdAt: '2023-09-15',
    },
    {
      id: 2,
      name: 'Office Chair',
      description: 'Ergonomic office chair with lumbar support',
      price: 249.99,
      quantity: 8,
      supplierId: 2,
      supplierName: 'Furniture Plus',
      lowStockThreshold: 10,
      category: 'Furniture',
      createdAt: '2023-08-22',
    },
    {
      id: 3,
      name: 'Smartphone X',
      description: '6.5-inch smartphone with 128GB storage',
      price: 899.99,
      quantity: 42,
      supplierId: 1,
      supplierName: 'TechWorld',
      lowStockThreshold: 15,
      category: 'Electronics',
      createdAt: '2023-10-01',
    },
    {
      id: 4,
      name: 'Printer MX100',
      description: 'Color laser printer with wireless connectivity',
      price: 349.99,
      quantity: 5,
      supplierId: 3,
      supplierName: 'Office Supplies Co',
      lowStockThreshold: 10,
      category: 'Electronics',
      createdAt: '2023-07-18',
    },
    {
      id: 5,
      name: 'Desk Lamp',
      description: 'LED desk lamp with adjustable brightness',
      price: 49.99,
      quantity: 30,
      supplierId: 2,
      supplierName: 'Furniture Plus',
      lowStockThreshold: 10,
      category: 'Furniture',
      createdAt: '2023-09-05',
    },
  ];

  const mockSuppliers: Supplier[] = [
    { id: 1, name: 'TechWorld' },
    { id: 2, name: 'Furniture Plus' },
    { id: 3, name: 'Office Supplies Co' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch actual data from your API
        // const response = await axios.get('/api/v1/product');
        // const data = response.data;
        
        // Using mock data for demonstration
        setProducts(mockProducts);
        setSuppliers(mockSuppliers);
        setFilteredProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply supplier filter
    if (supplierFilter !== 'all') {
      result = result.filter((product) => 
        product.supplierId === parseInt(supplierFilter)
      );
    }
    
    // Apply low stock filter
    if (showLowStock) {
      result = result.filter((product) => 
        product.quantity < product.lowStockThreshold
      );
    }
    
    setFilteredProducts(result);
  }, [searchTerm, supplierFilter, showLowStock, products]);

  const handleAddProduct = () => {
    setIsEditing(false);
    setCurrentProduct({
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      supplierId: suppliers.length > 0 ? suppliers[0].id : 0,
      lowStockThreshold: 10,
      category: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct({ ...product });
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // In a real app, you would call your API to delete the product
        // await axios.delete(`/api/v1/product/${id}`);
        
        // Update state to remove the deleted product
        setProducts(products.filter(product => product.id !== id));
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete product',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // In a real app, you would update the product via API
        // await axios.put(`/api/v1/product/${currentProduct.id}`, currentProduct);
        
        // Update the products array with the edited product
        setProducts(products.map(product => 
          product.id === currentProduct.id ? { ...product, ...currentProduct } as Product : product
        ));
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        // In a real app, you would create a new product via API
        // const response = await axios.post('/api/v1/product', currentProduct);
        // const newProduct = response.data;
        
        // Create mock new product for demonstration
        const newProduct = {
          ...currentProduct,
          id: Math.max(...products.map(p => p.id)) + 1,
          supplierName: suppliers.find(s => s.id === currentProduct.supplierId)?.name || '',
          createdAt: new Date().toISOString().split('T')[0],
        } as Product;
        
        setProducts([...products, newProduct]);
        toast({
          title: 'Success',
          description: 'Product added successfully',
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select defaultValue="all" onValueChange={setSupplierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lowStock">Stock Status</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="lowStock"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={showLowStock}
                  onChange={(e) => setShowLowStock(e.target.checked)}
                />
                <label htmlFor="lowStock" className="text-sm">Show only low stock items</label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Products List</CardTitle>
          <CardDescription>
            {filteredProducts.length} products found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="hidden md:table-cell">Supplier</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="truncate-2 max-w-xs">{product.description}</span>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {product.quantity}
                        {product.quantity < product.lowStockThreshold && (
                          <Badge variant="destructive" className="ml-2">Low</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{product.supplierName}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update the product details below'
                : 'Fill in the details for the new product'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitProduct}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={currentProduct.name}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={currentProduct.description}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentProduct.price}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={currentProduct.quantity}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, quantity: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={currentProduct.category}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, category: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min="0"
                    value={currentProduct.lowStockThreshold}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        lowStockThreshold: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select 
                  value={currentProduct.supplierId?.toString()} 
                  onValueChange={(value) => 
                    setCurrentProduct({ ...currentProduct, supplierId: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id.toString()}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
