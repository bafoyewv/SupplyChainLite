
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePermission } from '@/hooks/usePermission';
import { Users as UsersIcon, Search, Plus, Edit, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';

const Users = () => {
  const { can } = usePermission();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock users data with useState to enable CRUD operations
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', email: 'admin@example.com', role: 'ADMIN', lastLogin: '2023-06-10 09:15:23', status: 'Active' },
    { id: 2, username: 'john_doe', email: 'john@example.com', role: 'USER', lastLogin: '2023-06-09 14:22:45', status: 'Active' },
    { id: 3, username: 'sarah_smith', email: 'sarah@example.com', role: 'USER', lastLogin: '2023-06-08 16:05:12', status: 'Active' },
    { id: 4, username: 'supplier1', email: 'supplier1@example.com', role: 'SUPPLIER', lastLogin: '2023-06-07 10:30:56', status: 'Active' },
    { id: 5, username: 'mike_brown', email: 'mike@example.com', role: 'USER', lastLogin: '2023-05-28 08:45:33', status: 'Inactive' },
  ]);

  // Delete user handler
  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success("User deleted successfully");
  };

  // Edit user handler (just a toast for now)
  const handleEdit = (id: number) => {
    toast.info(`Editing user with ID: ${id}`);
  };

  // Add new user handler (just a toast for now)
  const handleAddUser = () => {
    toast.info("Opening new user form");
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users Management</h1>
        {can('user:manage') && (
          <Button onClick={handleAddUser}>
            <Plus className="mr-2 h-4 w-4" /> New User
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UsersIcon className="mr-2 h-5 w-5" />
            Users Overview
          </CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
          <div className="mt-2">
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
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
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {user.username}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'SUPPLIER' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

export default Users;
