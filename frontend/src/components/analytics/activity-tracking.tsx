import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function ActivityTracking() {
  // Sample activity data - in a real app, this would come from API
  const activities = [
    {
      name: "Daily Steps",
      current: 7200,
      goal: 10000,
      unit: "steps",
      color: "text-primary",
      bgColor: "bg-primary"
    },
    {
      name: "Sleep Hours",
      current: 6.5,
      goal: 8,
      unit: "hours",
      color: "text-green-600",
      bgColor: "bg-green-600"
    },
    {
      name: "Active Minutes",
      current: 45,
      goal: 60,
      unit: "minutes",
      color: "text-purple-600",
      bgColor: "bg-purple-600"
    }
  ];

  const getPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getStatusText = (current: number, goal: number) => {
    const percentage = getPercentage(current, goal);
    if (percentage >= 100) return "Goal achieved!";
    if (percentage >= 75) return "Almost there!";
    if (percentage >= 50) return "Good progress";
    return "Keep going!";
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Activity & Wellness Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.map((activity) => {
            const percentage = getPercentage(activity.current, activity.goal);
            
            return (
              <div key={activity.name} className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  {/* Background circle */}
                  <div className="w-24 h-24 rounded-full border-8 border-gray-200"></div>
                  
                  {/* Progress circle */}
                  <div 
                    className={`absolute top-0 left-0 w-24 h-24 rounded-full border-8 ${activity.bgColor} border-r-transparent transform`}
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${
                        percentage <= 50 
                          ? `${50 + percentage}% 0%` 
                          : `100% 0%, 100% ${percentage - 50}%`
                      }, 50% 50%)`
                    }}
                  ></div>
                  
                  {/* Value display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">
                      {typeof activity.current === 'number' && activity.current % 1 === 0
                        ? activity.current
                        : activity.current.toFixed(1)
                      }
                      {activity.unit === "steps" ? "k" : ""}
                    </span>
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-1">{activity.name}</h4>
                <p className="text-sm text-gray-600 mb-1">
                  Goal: {activity.goal.toLocaleString()} {activity.unit}
                </p>
                <p className={`text-xs font-medium ${activity.color}`}>
                  {Math.round(percentage)}% Complete
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getStatusText(activity.current, activity.goal)}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
