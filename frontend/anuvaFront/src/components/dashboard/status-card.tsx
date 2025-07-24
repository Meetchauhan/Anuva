import { Card, CardContent } from "@/components/ui/card";
import { CircleAlert, Edit, FlagTriangleRight } from "lucide-react";
import { DashboardStats } from "@/types";

interface StatusCardProps {
  stats: DashboardStats;
}

export function StatusCard({ stats }: StatusCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Active Patients */}
      <Card className="bg-card border-none shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground/70">Active Patients</h3>
            <span className="bg-primary px-2 py-1 rounded text-xs font-semibold text-white">
              {stats.activePatients}
            </span>
          </div>
          <div className="flex items-center">
            <div className="mr-3">
              <div className="text-5xl font-bold text-foreground">{stats.totalPatients}</div>
              <div className="text-sm text-foreground/60 mt-1">Total</div>
            </div>
            <div className="flex-grow flex items-center space-x-2">
              <div 
                className="h-3 bg-red-500 rounded-full flex-grow" 
                style={{ width: `${(stats.criticalCount / stats.activePatients) * 100}%` }}
              />
              <div 
                className="h-3 bg-yellow-500 rounded-full flex-grow" 
                style={{ width: `${(stats.recoveringCount / stats.activePatients) * 100}%` }}
              />
              <div 
                className="h-3 bg-green-500 rounded-full flex-grow" 
                style={{ width: `${(stats.stableCount / stats.activePatients) * 100}%` }}
              />
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-foreground/80">
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" />
              <span>Critical ({stats.criticalCount})</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1" />
              <span>Recovering ({stats.recoveringCount})</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />
              <span>Stable ({stats.stableCount})</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Today's Appointments */}
      <Card className="bg-card border-none shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground/70">Today's Appointments</h3>
            <span className="bg-primary px-2 py-1 rounded text-xs font-semibold text-white">
              {stats.todaysAppointments}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
                <span className="text-foreground/80">Initial Assessments</span>
              </div>
              <span className="text-sm font-medium text-primary-light">3</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary-light mr-2" />
                <span className="text-foreground/80">Follow-ups</span>
              </div>
              <span className="text-sm font-medium text-primary-light">5</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                <span className="text-foreground/80">Clearance Evaluations</span>
              </div>
              <span className="text-sm font-medium text-primary-light">1</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Documentation Status */}
      <Card className="bg-card border-none shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground/70">Documentation Status</h3>
            <button className="text-primary-light text-xs font-medium">View All</button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CircleAlert className="w-4 h-4 mr-2 text-red-500" />
                <span className="text-foreground/80">Pending Completion</span>
              </div>
              <span className="text-sm font-medium text-primary-light">{stats.pendingDocumentation}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Edit className="w-4 h-4 mr-2 text-primary-light" />
                <span className="text-foreground/80">AI Drafts Ready</span>
              </div>
              <span className="text-sm font-medium text-primary-light">{stats.aiDraftsReady}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FlagTriangleRight className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-foreground/80">Completed Today</span>
              </div>
              <span className="text-sm font-medium text-primary-light">{stats.completedToday}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
