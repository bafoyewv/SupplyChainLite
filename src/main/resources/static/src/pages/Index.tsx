
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Box, 
  BarChart, 
  CheckSquare 
} from 'lucide-react';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl w-full text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">SupplyChainLite</h1>
          <p className="text-xl text-gray-600">
            A simple inventory and supply chain management system for small businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            <p className="mt-2 text-lg text-gray-600">
              Everything you need to manage your inventory and supply chain
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Package className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  Track and manage all your products in one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Add, edit and delete products
                  </li>
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Track inventory levels
                  </li>
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Receive alerts for low stock
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Box className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Inventory Control</CardTitle>
                <CardDescription>
                  Maintain optimal inventory levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Track stock movements
                  </li>
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Monitor inventory value
                  </li>
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Automatic inventory adjustments
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingCart className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Order Management</CardTitle>
                <CardDescription>
                  Process and track orders with ease
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Create and manage orders
                  </li>
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Track order status
                  </li>
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Order history and analysis
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Supplier Management</CardTitle>
                <CardDescription>
                  Maintain relationships with suppliers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Supplier database
                  </li>
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Track supplier performance
                  </li>
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Manage supplier contacts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Gain insights into your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Visual reports and charts
                  </li>
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Track key performance metrics
                  </li>
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Customizable dashboard views
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Control access to your system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Role-based permissions
                  </li>
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Secure authentication
                  </li>
                  <li className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                    Activity logging
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          <p>© 2025 SupplyChainLite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
