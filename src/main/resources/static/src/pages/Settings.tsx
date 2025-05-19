
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import DBConfig from '@/components/DBConfig';
import { initDatabaseConnection, isDatabaseConnected, getConnectionDetails } from '@/utils/databaseService';

const Settings = () => {
  const [isDbConfigured, setIsDbConfigured] = React.useState(false);
  const [connectionDetails, setConnectionDetails] = React.useState<any>(null);

  // Check if database is already configured on mount
  React.useEffect(() => {
    const connection = initDatabaseConnection();
    const isConnected = isDatabaseConnected();
    setIsDbConfigured(isConnected);
    
    if (isConnected) {
      setConnectionDetails(getConnectionDetails());
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">System Settings</h1>
      </div>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Database Configuration
              </CardTitle>
              <CardDescription>
                Configure your PostgreSQL database connection settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isDbConfigured && connectionDetails ? (
                <div className="mb-4 p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Current Connection:</h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Host:</span> {connectionDetails.host}</div>
                    <div><span className="font-medium">Port:</span> {connectionDetails.port}</div>
                    <div><span className="font-medium">Database:</span> {connectionDetails.database}</div>
                    <div><span className="font-medium">Username:</span> {connectionDetails.username}</div>
                  </div>
                </div>
              ) : null}
              <DBConfig 
                onConfigured={() => {
                  setIsDbConfigured(true);
                  setConnectionDetails(getConnectionDetails());
                }} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage general application settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>General settings will be implemented in future updates.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
