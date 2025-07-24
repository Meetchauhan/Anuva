import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import Header from '@/components/layout/admin-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Settings() {
  const [aiMode, setAIMode] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  // Fetch current AI mode
  const { 
    data: aiModeData, 
    isLoading: aiModeLoading,
    isError: aiModeError,
    refetch: refetchAIMode 
  } = useQuery({
    queryKey: ['/api/ai-mode'],
    queryFn: async () => {
      const response = await fetch('/api/ai-mode');
      if (!response.ok) {
        throw new Error('Failed to fetch AI mode');
      }
      return response.json();
    }
  });

  // Update the AI mode toggle when data is loaded
  useEffect(() => {
    if (aiModeData) {
      setAIMode(aiModeData.enabled);
    }
  }, [aiModeData]);

  // Mutation to toggle AI mode
  const toggleAIModeMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const response = await apiRequest('POST', '/api/ai-mode', { enabled });
      return await response.json();
    },
    onSuccess: (data) => {
      setAIMode(data.enabled);
      toast({
        title: 'AI Mode Updated',
        description: `AI Enhanced Mode has been ${data.enabled ? 'enabled' : 'disabled'}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-mode'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Update AI Mode',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Mutation to set API key
  const setApiKeyMutation = useMutation({
    mutationFn: async (apiKey: string) => {
      const response = await apiRequest('POST', '/api/ai/key', { apiKey });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'API Key Updated',
        description: 'Your AI API key has been saved successfully.',
      });
      setApiKey('');
      refetchAIMode();
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Save API Key',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Handle AI mode toggle
  const handleAIModeToggle = () => {
    toggleAIModeMutation.mutate(!aiMode);
  };

  // Handle API key submission
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter a valid API key.',
        variant: 'destructive',
      });
      return;
    }
    setApiKeyMutation.mutate(apiKey);
  };

  return (
    <div className="p-4 md:p-6">
      <Header title="Settings" />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Enhancement Mode</CardTitle>
            <CardDescription>
              Enable or disable AI-enhanced documentation and clinical decision support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {aiModeLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading settings...</span>
              </div>
            ) : aiModeError ? (
              <div className="text-red-500">Error loading AI mode settings</div>
            ) : (
              <div className="flex items-center space-x-4">
                <Switch 
                  id="ai-mode" 
                  checked={aiMode}
                  onCheckedChange={handleAIModeToggle}
                  disabled={toggleAIModeMutation.isPending}
                />
                <Label htmlFor="ai-mode">
                  {aiMode ? 'Enhanced Mode (Using AI)' : 'Local Mode (No AI)'}
                </Label>
                {toggleAIModeMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Anthropic Claude API Key</CardTitle>
            <CardDescription>
              Configure your Anthropic API key to enable Claude AI enhanced capabilities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Anthropic API Key</Label>
                <Input 
                  id="api-key" 
                  type="password" 
                  placeholder="Enter your Anthropic Claude API key" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={setApiKeyMutation.isPending}
                />
                <p className="text-sm text-muted-foreground">
                  Your Anthropic API key will be stored securely and is required for enhanced Claude AI functionality.
                  You can get an API key from <a href="https://console.anthropic.com/keys" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Anthropic's Console</a>.
                </p>
              </div>
              <Button type="submit" disabled={setApiKeyMutation.isPending || !apiKey.trim()}>
                {setApiKeyMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save API Key'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About AI Integration</CardTitle>
          <CardDescription>
            How AI enhances the Anuva OS platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Local Mode vs. Enhanced Mode</h3>
            <p>
              Anuva OS can operate in two modes:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Local Mode:</strong> Uses rule-based processing for documentation assistance. No external AI service is required.</li>
              <li><strong>Enhanced Mode:</strong> Leverages Anthropic's Claude AI for improved documentation, clinical alerts, and decision support.</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Enhanced Capabilities</h3>
            <p>With AI enhancement enabled and a valid API key provided, you gain access to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Advanced SOAP note generation and enhancement</li>
              <li>Intelligent clinical alerts based on patient symptoms and history</li>
              <li>Suggested orders with supporting evidence</li>
              <li>Symptom trend analysis with recovery projections</li>
              <li>Risk assessment for concussion management</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}