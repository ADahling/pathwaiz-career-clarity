
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { supabase, getSecret } from '@/integrations/supabase/client';

interface ApiKey {
  name: string;
  description: string;
  isSet: boolean;
}

const ApiKeyManager: React.FC = () => {
  const { user, userRole } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { name: 'OPENAI_API_KEY', description: 'OpenAI API Key for AI features', isSet: false },
    { name: 'STRIPE_SECRET_KEY', description: 'Stripe Secret Key for payments', isSet: false },
    { name: 'SENDGRID_API_KEY', description: 'SendGrid API Key for emails', isSet: false },
  ]);
  const [currentKey, setCurrentKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check which keys are already set
  useEffect(() => {
    const checkKeys = async () => {
      if (!user) return;
      
      setChecking(true);
      
      try {
        // Use Supabase functions to check which secrets are set
        const { data, error } = await supabase.functions.invoke('check-secrets', {
          body: { secretNames: apiKeys.map(key => key.name) }
        });
        
        if (error) throw error;
        
        if (data?.results) {
          setApiKeys(prevKeys => 
            prevKeys.map(key => ({
              ...key,
              isSet: data.results[key.name] || false
            }))
          );
        }
      } catch (error) {
        console.error('Error checking API keys:', error);
        toast.error('Failed to check existing API keys');
      } finally {
        setChecking(false);
      }
    };
    
    checkKeys();
  }, [user]);

  const handleSaveKey = async (keyName: string) => {
    if (!currentKey.trim()) {
      toast.error('API key cannot be empty');
      return;
    }
    
    setLoading(true);
    
    try {
      // Use Supabase functions to securely save the secret
      const { error } = await supabase.functions.invoke('set-secret', {
        body: { secretName: keyName, secretValue: currentKey }
      });
      
      if (error) throw error;
      
      // Update local state to show key is set
      setApiKeys(prevKeys => 
        prevKeys.map(key => 
          key.name === keyName ? { ...key, isSet: true } : key
        )
      );
      
      setCurrentKey('');
      toast.success(`${keyName} saved successfully`);
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  if (!user || userRole !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
          <CardDescription>You need admin permissions to access this area.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>API Key Manager</CardTitle>
        <CardDescription>
          Securely store and manage API keys for your application.
          These keys are stored as environment variables in Supabase.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={apiKeys[0]?.name}>
          <TabsList className="grid grid-cols-3">
            {apiKeys.map(key => (
              <TabsTrigger key={key.name} value={key.name} className="relative">
                {key.name.split('_')[0]}
                {key.isSet && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {apiKeys.map(key => (
            <TabsContent key={key.name} value={key.name} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`input-${key.name}`}>{key.name}</Label>
                <div className="text-sm text-muted-foreground mb-2">{key.description}</div>
                
                {key.isSet ? (
                  <div className="flex items-center space-x-2">
                    <Input 
                      id={`input-${key.name}`} 
                      type="password" 
                      value="••••••••••••••••••••••••••" 
                      disabled 
                      className="font-mono"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setApiKeys(prevKeys => 
                          prevKeys.map(k => 
                            k.name === key.name ? { ...k, isSet: false } : k
                          )
                        );
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Input 
                      id={`input-${key.name}`} 
                      type="password" 
                      placeholder={`Enter your ${key.name}`}
                      value={currentKey} 
                      onChange={(e) => setCurrentKey(e.target.value)}
                      className="font-mono"
                    />
                    <Button 
                      onClick={() => handleSaveKey(key.name)} 
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Your API keys are securely stored and never exposed to the client.
        </div>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyManager;
