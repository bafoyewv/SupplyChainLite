
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShoppingCart, Search, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const OrderProducts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<Array<{id: number, name: string, price: number, quantity: number}>>([]);
  
  // Mock products data
  const products = [
    { id: 1, name: 'Laptop', price: 1200, stock: 15 },
    { id: 2, name: 'Smartphone', price: 800, stock: 25 },
    { id: 3, name: 'Tablet', price: 450, stock: 10 },
    { id: 4, name: 'Monitor', price: 350, stock: 20 },
    { id: 5, name: 'Keyboard', price: 80, stock: 30 },
    { id: 6, name: 'Mouse', price: 50, stock: 40 },
  ];
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Add product to cart
  const addToCart = (product: {id: number, name: string, price: number}) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    
    toast.success(`Added ${product.name} to cart`);
  };
  
  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  // Update item quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Proceed to checkout (simulate payment process failure)
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    navigate('/payment');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order Products</h1>
        <Button onClick={proceedToCheckout} disabled={cartItems.length === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" /> 
          Checkout ({cartItems.length})
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Products</CardTitle>
              <CardDescription>Browse and add products to your cart</CardDescription>
              <div className="mt-2">
                <div className="relative max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
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
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock} units</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addToCart(product)}
                            disabled={product.stock <= 0}
                          >
                            Add to Cart
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Your Cart
              </CardTitle>
              <CardDescription>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Your cart is empty.
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col items-start">
              <div className="flex justify-between w-full py-2 border-t border-b mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <Button 
                className="w-full" 
                onClick={proceedToCheckout}
                disabled={cartItems.length === 0}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Payment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderProducts;
