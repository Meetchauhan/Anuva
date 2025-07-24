import { useSettings } from "@/context/settings-context";
import { AlertTriangle, Check, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function EnhancedAIDocumentation() {
  const { settings } = useSettings();
  
  // If AI enhancement is already enabled and API key is set
  if (settings.aiEnhanced && settings.anthropicApiKey) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800 font-medium">AI Enhancement Active</AlertTitle>
        <AlertDescription className="text-green-700">
          AI-powered clinical documentation and decision support is enabled.
        </AlertDescription>
      </Alert>
    );
  }
  
  // If AI enhancement is enabled but API key is missing
  if (settings.aiEnhanced && !settings.anthropicApiKey) {
    return (
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertTitle className="text-amber-800 font-medium">API Key Required</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span className="text-amber-700">
            AI enhancement is enabled but requires an Anthropic API key.
          </span>
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings">Add API Key</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  // If AI enhancement is disabled
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Info className="h-5 w-5 text-blue-600" />
      <AlertTitle className="text-blue-800 font-medium">AI Enhancement Available</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span className="text-blue-700">
          Enable AI-powered clinical documentation in settings.
        </span>
        <Button variant="outline" size="sm" asChild>
          <Link href="/settings">Enable AI</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}