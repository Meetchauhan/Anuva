import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import WelcomeBanner from "@/components/layout/welcome-banner";
import TabNavigation from "@/components/layout/tab-navigation";
import ProfileForm from "@/components/settings/profile-form";
import PrivacySettings from "@/components/settings/privacy-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { EmergencyContact } from "@shared/schema";

export default function Settings() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: emergencyContacts = [] } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/emergency-contacts"],
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

  const deleteContactMutation = useMutation({
    mutationFn: async (contactId: number) => {
      await apiRequest("DELETE", `/api/emergency-contacts/${contactId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-contacts"] });
      toast({
        title: "Contact Deleted",
        description: "Emergency contact has been removed.",
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
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      });
    },
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <WelcomeBanner />
      <TabNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information & Emergency Contacts */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileForm />

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                {emergencyContacts.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p className="text-sm">No emergency contacts added</p>
                    <p className="text-xs mt-1">Add emergency contacts for healthcare situations</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emergencyContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                            {contact.isPrimary && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                Primary
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{contact.relationship}</p>
                          <p className="text-sm text-gray-600">{contact.phone}</p>
                          {contact.email && (
                            <p className="text-sm text-gray-600">{contact.email}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              toast({
                                title: "Feature Coming Soon",
                                description: "Contact editing will be available soon.",
                              });
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteContactMutation.mutate(contact.id)}
                            disabled={deleteContactMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  variant="outline"
                  className="mt-4 w-full border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600"
                  onClick={() => {
                    toast({
                      title: "Feature Coming Soon",
                      description: "Adding emergency contacts will be available soon.",
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Emergency Contact
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div>
            <PrivacySettings />
          </div>
        </div>
      </main>
    </div>
  );
}
