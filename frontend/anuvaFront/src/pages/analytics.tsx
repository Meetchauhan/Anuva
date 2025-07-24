import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import WelcomeBanner from "@/components/layout/welcome-banner";
import TabNavigation from "@/components/layout/tab-navigation";
import HealthMetrics from "@/components/analytics/health-metrics";
import ActivityTracking from "@/components/analytics/activity-tracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LabResult } from "@shared/schema";

export default function Analytics() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: labResults = [] } = useQuery<LabResult[]>({
    queryKey: ["/api/lab-results"],
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-16 bg-white border-b"></div>
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700"></div>
          <div className="h-16 bg-white border-b"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "normal":
        return "bg-green-100 text-green-800";
      case "high":
      case "low":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <WelcomeBanner />
      <TabNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Health Metrics Overview */}
          <HealthMetrics />

          {/* Recent Lab Results */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Lab Results</CardTitle>
            </CardHeader>
            <CardContent>
              {labResults.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">No lab results available</p>
                  <p className="text-xs mt-1">Your test results will appear here when available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {labResults.slice(0, 5).map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">{result.testName}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(result.testDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary" 
                          className={getStatusBadgeColor(result.status)}
                        >
                          {result.status}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1">
                          {result.result} {result.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Tracking */}
          <ActivityTracking />
        </div>
      </main>
    </div>
  );
}
