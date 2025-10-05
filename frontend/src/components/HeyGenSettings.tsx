import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export const HeyGenSettings = () => {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_HEYGEN_API_KEY || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleSaveSettings = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid HeyGen API key');
      return;
    }
    
    // In a real app, you'd save this securely
    localStorage.setItem('heygen_api_key', apiKey);
    toast.success('HeyGen API key saved successfully!');
  };

  const testConnection = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key first');
      return;
    }

    setIsTestingConnection(true);
    
    try {
      // Test connection with a simple API call
      const response = await fetch('https://api.heygen.com/v2/avatars', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        toast.success('Connection successful! HeyGen API is working.');
      } else {
        toast.error('Connection failed. Please check your API key.');
      }
    } catch (error) {
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          HeyGen Configuration
        </CardTitle>
        <CardDescription>
          Configure your HeyGen API key to enable interactive avatar features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="relative">
            <Input
              id="api-key"
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your HeyGen API key"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSaveSettings} className="flex-1">
            Save Settings
          </Button>
          <Button 
            onClick={testConnection} 
            variant="outline"
            disabled={isTestingConnection}
            className="flex-1"
          >
            {isTestingConnection ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Get your API key from <a href="https://app.heygen.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">HeyGen Dashboard</a></p>
        </div>
      </CardContent>
    </Card>
  );
};