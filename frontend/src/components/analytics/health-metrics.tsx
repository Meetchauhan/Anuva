import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Timer, AlertTriangle } from "lucide-react";
import type { HealthMetric } from "@shared/schema";

export default function HealthMetrics() {
  const { data: healthMetrics = [], isLoading } = useQuery<HealthMetric[]>({
    queryKey: ["/api/health-metrics"],
  });

  const getLatestMetric = (metricType: string) => {
    return healthMetrics.find(metric => metric.metricType === metricType);
  };

  const getMetricStatus = (metricType: string, value: string) => {
    switch (metricType) {
      case "symptom_severity":
        const severity = parseInt(value);
        if (severity >= 8) return { status: "severe", color: "text-red-600", bg: "bg-red-50" };
        if (severity >= 5) return { status: "moderate", color: "text-yellow-600", bg: "bg-yellow-50" };
        if (severity >= 1) return { status: "mild", color: "text-blue-600", bg: "bg-blue-50" };
        return { status: "none", color: "text-green-600", bg: "bg-green-50" };
      
      case "cognitive_score":
        const score = parseInt(value);
        if (score >= 80) return { status: "excellent", color: "text-green-600", bg: "bg-green-50" };
        if (score >= 60) return { status: "good", color: "text-blue-600", bg: "bg-blue-50" };
        if (score >= 40) return { status: "concerning", color: "text-yellow-600", bg: "bg-yellow-50" };
        return { status: "poor", color: "text-red-600", bg: "bg-red-50" };
      
      case "reaction_time":
        const time = parseInt(value);
        if (time <= 200) return { status: "excellent", color: "text-green-600", bg: "bg-green-50" };
        if (time <= 300) return { status: "good", color: "text-blue-600", bg: "bg-blue-50" };
        if (time <= 400) return { status: "slow", color: "text-yellow-600", bg: "bg-yellow-50" };
        return { status: "very slow", color: "text-red-600", bg: "bg-red-50" };
      
      case "balance_test":
        const balance = parseInt(value);
        if (balance >= 90) return { status: "excellent", color: "text-green-600", bg: "bg-green-50" };
        if (balance >= 70) return { status: "good", color: "text-primary", bg: "bg-green-50" };
        if (balance >= 50) return { status: "impaired", color: "text-yellow-600", bg: "bg-yellow-50" };
        return { status: "poor", color: "text-red-600", bg: "bg-red-50" };
      
      default:
        return { status: "normal", color: "text-green-600", bg: "bg-green-50" };
    }
  };

  const metrics = [
    {
      type: "symptom_severity",
      label: "Symptom Severity",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      defaultValue: "--",
      unit: "/10"
    },
    {
      type: "cognitive_score",
      label: "Cognitive Score",
      icon: Brain,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      defaultValue: "--",
      unit: "%"
    },
    {
      type: "reaction_time",
      label: "Reaction Time",
      icon: Timer,
      color: "text-green-600",
      bgColor: "bg-green-50",
      defaultValue: "--",
      unit: "ms"
    },
    {
      type: "balance_test",
      label: "Balance Score",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      defaultValue: "--",
      unit: "%"
    }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Neurological Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg p-4 h-24"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neurological Health Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => {
            const latestMetric = getLatestMetric(metric.type);
            const value = latestMetric?.value || metric.defaultValue;
            const status = latestMetric ? getMetricStatus(metric.type, value) : null;
            const Icon = metric.icon;

            return (
              <div
                key={metric.type}
                className={`p-4 rounded-lg ${status?.bg || metric.bgColor}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {metric.label}
                  </span>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {value}
                  {latestMetric && metric.unit && (
                    <span className="text-sm font-normal text-gray-600 ml-1">
                      {metric.unit}
                    </span>
                  )}
                </p>
                {status && (
                  <p className={`text-xs capitalize ${status.color}`}>
                    {status.status === "normal" || status.status === "excellent" ? 
                      status.status + " range" : 
                      status.status
                    }
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
