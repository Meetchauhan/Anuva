import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { Trophy, Target, Calendar, Star, TrendingUp } from "lucide-react";
import type { UserProgress } from "../../../../backend/shared/schema";

export default function ProgressOverview() {
  const { data: userProgress, isLoading } = useQuery<UserProgress>({
    queryKey: ["/api/user-progress"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default values to handle undefined data
  const progress = userProgress || {
    totalFormsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalPoints: 0,
    level: 1,
    experiencePoints: 0
  };

  const level = progress.level || 1;
  const experiencePoints = progress.experiencePoints || 0;
  const nextLevelXP = level * 100;
  const currentLevelXP = (level - 1) * 100;
  const progressToNextLevel = ((experiencePoints - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level and XP Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Level {level}
              </Badge>
              <span className="text-sm text-gray-600">
                {experiencePoints} XP
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {nextLevelXP - experiencePoints} XP to next level
            </span>
          </div>
          <Progress value={Math.max(0, Math.min(100, progressToNextLevel))} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {progress.totalFormsCompleted}
            </div>
            <div className="text-xs text-gray-600">Forms Completed</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Star className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {progress.totalPoints}
            </div>
            <div className="text-xs text-gray-600">Total Points</div>
          </div>

          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {progress.currentStreak}
            </div>
            <div className="text-xs text-gray-600">Current Streak</div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {progress.longestStreak}
            </div>
            <div className="text-xs text-gray-600">Best Streak</div>
          </div>
        </div>

        {/* Streak Status */}
        {(progress.currentStreak || 0) > 0 && (
          <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">
                {progress.currentStreak || 0} day streak! 
                {(progress.currentStreak || 0) >= 3 && " You're on fire!"}
                {(progress.currentStreak || 0) >= 7 && " Incredible dedication!"}
                {(progress.currentStreak || 0) >= 14 && " You're unstoppable!"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}