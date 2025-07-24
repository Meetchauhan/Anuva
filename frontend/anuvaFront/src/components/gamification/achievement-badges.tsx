import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Calendar, CheckCircle2, Shield, Star } from "lucide-react";
import type { Achievement } from "@shared/schema";

export default function AchievementBadges() {
  const { data: achievements = [], isLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Target": return Target;
      case "Calendar": return Calendar;
      case "CheckCircle2": return CheckCircle2;
      case "Shield": return Shield;
      case "Star": return Star;
      default: return Trophy;
    }
  };

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
  const lockedAchievements = achievements.filter((a) => !a.isUnlocked);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Achievements
          <Badge variant="secondary" className="ml-auto">
            {unlockedAchievements.length}/{achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Complete forms to unlock achievements</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Unlocked Achievements */}
            {unlockedAchievements.map((achievement) => {
              const Icon = getIcon(achievement.iconName || "Trophy");
              return (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div 
                    className="p-2 rounded-full"
                    style={{ backgroundColor: (achievement.color || "#10B981") + '20' }}
                  >
                    <Icon 
                      className="w-5 h-5" 
                      style={{ color: achievement.color || "#10B981" }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Unlocked!
                  </Badge>
                </div>
              );
            })}

            {/* Locked Achievements */}
            {lockedAchievements.map((achievement) => {
              const Icon = getIcon(achievement.iconName || "Trophy");
              const progressPercent = (achievement.target || 0) > 0 ? ((achievement.progress || 0) / (achievement.target || 1)) * 100 : 0;
              
              return (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="p-2 rounded-full bg-gray-200">
                    <Icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-700">{achievement.title}</h4>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{achievement.progress || 0}/{achievement.target || 0}</span>
                        <span>{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}