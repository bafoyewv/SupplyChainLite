
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database } from 'lucide-react';
import { toast } from 'sonner';

interface DBConfigProps {
  onConfigured?: () => void;
}

const DBConfig: React.FC<DBConfigProps> = ({ onConfigured }) => {
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('5432');
  const [username, setUsername] = useState('postgres');
  const [password, setPassword] = useState('');
  const [database, setDatabase] = useState('inventory');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  const handleConnectDatabase = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would connect to PostgreSQL
      // For now, we'll just simulate a successful connection
      const connectionConfig = {
        host,
        port: Number(port),
        username,
        password,
        database
      };
      
      console.log('Connecting to PostgreSQL with config:', connectionConfig);
      
      // Store the connection in localStorage (in a real app, you might want to encrypt sensitive info)
      localStorage.setItem('pgConfig', JSON.stringify(connectionConfig));
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsConfigured(true);
      toast.success('PostgreSQL connection configured successfully');
      
      if (onConfigured) {
        onConfigured();
      }
    } catch (error) {
      console.error('Failed to configure PostgreSQL connection:', error);
      toast.error('Failed to configure PostgreSQL connection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          PostgreSQL Configuration
        </CardTitle>
        <CardDescription>
          Configure your PostgreSQL database connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            placeholder="localhost"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            disabled={isConfigured}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            placeholder="5432"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            disabled={isConfigured}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="postgres"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isConfigured}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Your database password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isConfigured}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="database">Database</Label>
          <Input
            id="database"
            placeholder="inventory"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            disabled={isConfigured}
          />
        </div>
      </CardContent>
      <CardFooter>
        {!isConfigured ? (
          <Button 
            onClick={handleConnectDatabase} 
            disabled={isLoading || !host || !port || !username || !database}
            className="w-full"
          >
            {isLoading ? 'Connecting...' : 'Connect to PostgreSQL'}
          </Button>
        ) : (
          <Button 
            onClick={() => setIsConfigured(false)}
            variant="outline" 
            className="w-full"
          >
            Reconfigure
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DBConfig;
