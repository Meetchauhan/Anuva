import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Download, Trash2, Lock } from "lucide-react";
import type { UserSettings } from "@shared/schema";

export default function PrivacySettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: ["/api/user-settings"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      await apiRequest("POST", "/api/user-settings", newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-settings"] });
      toast({
        title: "Settings Updated",
        description: "Your privacy and notification settings have been updated.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSettingChange = (key: keyof UserSettings, value: boolean) => {
    if (!settings) return;
    
    updateSettingsMutation.mutate({
      ...settings,
      [key]: value,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Privacy & Sharing */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Sharing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Share with Family</h4>
              <p className="text-sm text-gray-600">
                Allow family members to view your health summary
              </p>
            </div>
            <Switch
              checked={settings?.shareWithFamily || false}
              onCheckedChange={(checked) => handleSettingChange("shareWithFamily", checked)}
              disabled={updateSettingsMutation.isPending}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Share with Providers</h4>
              <p className="text-sm text-gray-600">
                Allow other healthcare providers to access your records
              </p>
            </div>
            <Switch
              checked={settings?.shareWithProviders ?? true}
              onCheckedChange={(checked) => handleSettingChange("shareWithProviders", checked)}
              disabled={updateSettingsMutation.isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Appointment Reminders</h4>
              <p className="text-sm text-gray-600">Get notified before appointments</p>
            </div>
            <Switch
              checked={settings?.appointmentReminders ?? true}
              onCheckedChange={(checked) => handleSettingChange("appointmentReminders", checked)}
              disabled={updateSettingsMutation.isPending}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Form Reminders</h4>
              <p className="text-sm text-gray-600">Remind me to complete forms</p>
            </div>
            <Switch
              checked={settings?.formReminders ?? true}
              onCheckedChange={(checked) => handleSettingChange("formReminders", checked)}
              disabled={updateSettingsMutation.isPending}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Test Results</h4>
              <p className="text-sm text-gray-600">Notify when results are available</p>
            </div>
            <Switch
              checked={settings?.testResultNotifications ?? true}
              onCheckedChange={(checked) => handleSettingChange("testResultNotifications", checked)}
              disabled={updateSettingsMutation.isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              toast({
                title: "Feature Coming Soon",
                description: "Password change functionality will be available soon.",
              });
            }}
          >
            <Lock className="w-4 h-4 mr-3" />
            Change Password
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              toast({
                title: "Feature Coming Soon",
                description: "Data export functionality will be available soon.",
              });
            }}
          >
            <Download className="w-4 h-4 mr-3" />
            Download My Data
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              toast({
                title: "Account Deletion",
                description: "Please contact support to delete your account.",
                variant: "destructive",
              });
            }}
          >
            <Trash2 className="w-4 h-4 mr-3" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
