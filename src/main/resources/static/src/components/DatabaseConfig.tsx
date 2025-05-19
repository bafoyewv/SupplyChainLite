
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database } from 'lucide-react';
import { initializeBackendServices } from '@/services/api';
import { toast } from 'sonner';

interface DatabaseConfigProps {
  onConfigured?: () => void;
}

const DatabaseConfig: React.FC<DatabaseConfigProps> = ({ onConfigured }) => {
  const [apiUrl, setApiUrl] = useState('/api/v1');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  const handleConnectDatabase = async () => {
    setIsLoading(true);
    try {
      const connection = initializeBackendServices({
        apiUrl,
        apiKey: apiKey || undefined,
        timeout: 10000
      });
      
      localStorage.setItem('dbConfig', JSON.stringify({ apiUrl, apiKey }));
      
      setIsConfigured(true);
      toast.success('Database connection configured successfully');
      
      if (onConfigured) {
        onConfigured();
      }
    } catch (error) {
      console.error('Failed to configure database connection:', error);
      toast.error('Failed to configure database connection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Configuration
        </CardTitle>
        <CardDescription>
          Configure your database connection settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-url">API URL</Label>
          <Input
            id="api-url"
            placeholder="https://api.example.com"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            disabled={isConfigured}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key (Optional)</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={isConfigured}
          />
        </div>
      </CardContent>
      <CardFooter>
        {!isConfigured ? (
          <Button 
            onClick={handleConnectDatabase} 
            disabled={isLoading || !apiUrl}
            className="w-full"
          >
            {isLoading ? 'Connecting...' : 'Connect to Database'}
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

export default DatabaseConfig;
