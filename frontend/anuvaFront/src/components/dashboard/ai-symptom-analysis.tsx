import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Brain, LineChart, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AISymptomAnalysisProps {
  patientId: number;
}

interface VisualizationRecommendation {
  type: string;
  title: string;
  description: string;
  rationale: string;
}

interface SymptomAnalysis {
  insights: string;
  recommendations: string[];
  riskLevel: 'improving' | 'stable' | 'deteriorating';
  visualizationRecommendations: VisualizationRecommendation[];
}

export function AISymptomAnalysis({ patientId }: AISymptomAnalysisProps) {
  // Fetch AI analysis
  const { data, isLoading, isError } = useQuery<SymptomAnalysis>({
    queryKey: [`/api/patients/${patientId}/symptom-analysis`],
    enabled: !!patientId
  });

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Claude AI Symptom Analysis
          </CardTitle>
          <CardDescription>Analyzing symptom data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-pulse bg-primary/20 rounded-full h-10 w-10 flex items-center justify-center mb-2">
                <Brain className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground">Analyzing symptom patterns and trends...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            AI Analysis Unavailable
          </CardTitle>
          <CardDescription>Could not retrieve AI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Analysis Error</AlertTitle>
            <AlertDescription>
              Unable to generate AI analysis for this patient's symptom data. This could be due to a temporary issue with our AI service or insufficient symptom data.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'improving':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'stable':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'deteriorating':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              Claude AI Symptom Analysis
            </CardTitle>
            <CardDescription>Advanced AI-powered analysis of symptom progression</CardDescription>
          </div>
          <Badge className={getRiskBadgeColor(data.riskLevel)}>
            {data.riskLevel === 'improving' && <CheckCircle className="h-3.5 w-3.5 mr-1" />}
            {data.riskLevel === 'stable' && <ArrowRight className="h-3.5 w-3.5 mr-1" />}
            {data.riskLevel === 'deteriorating' && <AlertTriangle className="h-3.5 w-3.5 mr-1" />}
            {data.riskLevel.charAt(0).toUpperCase() + data.riskLevel.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Clinical Insights */}
          <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
            <h3 className="text-base font-medium flex items-center mb-2">
              <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
              Clinical Insights
            </h3>
            <p className="text-sm">{data.insights}</p>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-base font-medium mb-3">Recommendations</h3>
            <div className="space-y-2">
              {data.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start">
                  <div className="mt-0.5 mr-2 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visualization Recommendations */}
          {data.visualizationRecommendations && data.visualizationRecommendations.length > 0 && (
            <div>
              <Separator className="my-4" />
              <h3 className="text-base font-medium flex items-center mb-3">
                <LineChart className="h-4 w-4 mr-2 text-blue-500" />
                Recommended Visualizations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.visualizationRecommendations.map((rec, index) => (
                  <div key={index} className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {rec.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}