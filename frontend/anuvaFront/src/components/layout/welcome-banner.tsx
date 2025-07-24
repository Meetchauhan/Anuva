import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { Appointment, User } from "@shared/schema";

export default function WelcomeBanner() {
  const { user } = useAuth() as { user: User | undefined; isLoading: boolean; isAuthenticated: boolean };
  
  const { data: upcomingAppointments = [] } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments/upcoming"],
  });

  const nextAppointment = upcomingAppointments[0];
  const firstName = user?.firstName || "Patient";

  return (
    <div className="from-blue-600 to-blue-700 text-white py-8 bg-[#1F5A42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Welcome, {firstName}
            </h2>
            {nextAppointment ? (
              <p className="text-blue-100">
                Your next appointment is on{' '}
                {new Date(nextAppointment.scheduledAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}{' '}
                at{' '}
                {new Date(nextAppointment.scheduledAt).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            ) : (
              <p className="text-blue-100">
                Your neurological care dashboard. Track recovery and connect with your care team.
              </p>
            )}
          </div>
          <div className="hidden sm:block">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/20">
                <span className="text-2xl font-bold text-white">
                  {firstName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
