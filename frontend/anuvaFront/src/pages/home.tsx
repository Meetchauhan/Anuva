import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import WelcomeBanner from "@/components/layout/welcome-banner";
import TabNavigation from "@/components/layout/tab-navigation";
import TodoList from "@/components/todo/todo-list";
import ProgressOverview from "@/components/gamification/progress-overview";
import AchievementBadges from "@/components/gamification/achievement-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageCircle, FileText, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Appointment } from "@shared/schema";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: upcomingAppointments = [] } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments/upcoming"],
  });

  // Redirect to home if not authenticated
  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     toast({
  //       title: "Unauthorized",
  //       description: "You are logged out. Logging in again...",
  //       variant: "destructive",
  //     });
  //     setTimeout(() => {
  //       window.location.href = "/api/login";
  //     }, 500);
  //     return;
  //   }
  // }, [isAuthenticated, isLoading, toast]);

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <div className="animate-pulse">
  //         <div className="h-16 bg-white border-b"></div>
  //         <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700"></div>
  //         <div className="h-16 bg-white border-b"></div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!isAuthenticated) {
  //   return null; // Will redirect via useEffect
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <WelcomeBanner />
      <TabNavigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* TO-DO List */}
          <div className="lg:col-span-2">
            <TodoList />
          </div>

          {/* Progress & Achievements */}
          <div className="space-y-6">
            <ProgressOverview />
            <AchievementBadges />
            
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No upcoming appointments</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="border-l-4 border-blue-600 pl-4 text-left bg-[transparent] text-[#020817]">
                        <h4 className="font-semibold text-gray-900">
                          {appointment.providerName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {appointment.appointmentType}
                        </p>
                        <p className="text-sm font-medium text-[#154734]">
                          {new Date(appointment.scheduledAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })} • {new Date(appointment.scheduledAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
