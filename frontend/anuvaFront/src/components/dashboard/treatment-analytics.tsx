import React from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ComposedChart,
  Bar,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SoapNote, PatientWithRisk } from "@/types";

interface TreatmentAnalyticsProps {
  patients: PatientWithRisk[];
  soapNotes?: SoapNote[];
  loading?: boolean;
  error?: string;
}

// Sample data for treatment effectiveness (In a real app, this would be calculated from actual patient data)
const treatmentEffectivenessData = [
  { name: 'Week 1', cognitive: 10, physical: 15, vestibular: 8, medication: 12 },
  { name: 'Week 2', cognitive: 18, physical: 25, vestibular: 15, medication: 20 },
  { name: 'Week 3', cognitive: 25, physical: 32, vestibular: 22, medication: 26 },
  { name: 'Week 4', cognitive: 32, physical: 38, vestibular: 28, medication: 30 },
  { name: 'Week 5', cognitive: 36, physical: 42, vestibular: 33, medication: 33 },
  { name: 'Week 6', cognitive: 40, physical: 45, vestibular: 37, medication: 35 },
];

const recoveryTimelineData = [
  { name: 'Day 0', symptomScore: 85, activities: 0 },
  { name: 'Day 3', symptomScore: 76, activities: 1 },
  { name: 'Day 7', symptomScore: 65, activities: 2 },
  { name: 'Day 14', symptomScore: 48, activities: 3 },
  { name: 'Day 21', symptomScore: 36, activities: 5 },
  { name: 'Day 28', symptomScore: 25, activities: 7 },
  { name: 'Day 35', symptomScore: 18, activities: 8 },
  { name: 'Day 42', symptomScore: 12, activities: 9 },
];

export function TreatmentAnalytics({ patients, soapNotes = [], loading, error }: TreatmentAnalyticsProps) {
  // Treatment plan distribution
  const treatmentStats = React.useMemo(() => {
    // In a real app, you would extract this from the soap notes or treatment plans
    return [
      { name: 'Cognitive Rest', count: 28, percentage: 93 },
      { name: 'Gradual Return to Activity', count: 26, percentage: 87 },
      { name: 'Physical Therapy', count: 22, percentage: 73 },
      { name: 'Vestibular Rehabilitation', count: 18, percentage: 60 },
      { name: 'Medication Management', count: 15, percentage: 50 },
      { name: 'Cognitive Behavioral Therapy', count: 12, percentage: 40 },
      { name: 'Sleep Hygiene Education', count: 25, percentage: 83 },
      { name: 'Nutritional Counseling', count: 14, percentage: 47 },
    ];
  }, [patients]);
  
  // Top clinical recommendations
  const clinicalRecommendations = React.useMemo(() => {
    return [
      { id: 1, title: 'Gradual Return to Activity Protocol', efficacy: 'High', applicability: 'All patients' },
      { id: 2, title: 'Vestibular Rehabilitation', efficacy: 'High', applicability: 'Patients with dizziness/balance issues' },
      { id: 3, title: 'Sleep Hygiene Optimization', efficacy: 'Medium', applicability: 'Patients with sleep disturbances' },
      { id: 4, title: 'Cognitive Rehabilitation Exercises', efficacy: 'Medium', applicability: 'Patients with persistent cognitive symptoms' },
      { id: 5, title: 'Targeted Physical Therapy', efficacy: 'High', applicability: 'Patients with neck pain/headaches' },
    ];
  }, []);
  
  if (loading) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 mb-6">
        <CardHeader>
          <CardTitle>Clinical Treatment Analytics</CardTitle>
          <CardDescription>Loading treatment analytics...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 mb-6">
        <CardHeader>
          <CardTitle>Clinical Treatment Analytics</CardTitle>
          <CardDescription className="text-status-red">
            Error loading analytics: {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="bg-neutral-900 border-neutral-800 mb-6">
      <CardHeader>
        <CardTitle>Clinical Treatment Analytics</CardTitle>
        <CardDescription>
          Evidence-based treatment effectiveness and outcome prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="effectiveness">
          <TabsList className="mb-4">
            <TabsTrigger value="effectiveness">Treatment Effectiveness</TabsTrigger>
            <TabsTrigger value="patterns">Recovery Patterns</TabsTrigger>
            <TabsTrigger value="recommendations">Clinical Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="effectiveness" className="space-y-4">
            {/* Treatment Effectiveness Chart */}
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Treatment Effectiveness (% Symptom Reduction)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={treatmentEffectivenessData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                      <XAxis dataKey="name" stroke="#888888" />
                      <YAxis stroke="#888888" domain={[0, 50]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#333333', borderColor: '#444444' }}
                        formatter={(value) => [`${value}%`, 'Symptom Reduction']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="cognitive" 
                        name="Cognitive Therapy" 
                        stroke="#6E40C9" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="physical" 
                        name="Physical Therapy" 
                        stroke="#3182CE" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="vestibular" 
                        name="Vestibular Rehab" 
                        stroke="#F59E0B" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="medication" 
                        name="Medication Management" 
                        stroke="#10B981" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Treatment Plan Distribution */}
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Treatment Plan Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {treatmentStats.map((treatment) => (
                    <div key={treatment.name} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{treatment.name}</span>
                        <span className="text-sm text-neutral-400">
                          {treatment.count} patients ({treatment.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-neutral-700 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${treatment.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patterns" className="space-y-4">
            {/* Typical Recovery Timeline */}
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Typical Recovery Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={recoveryTimelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                      <XAxis dataKey="name" stroke="#888888" />
                      <YAxis 
                        yAxisId="left" 
                        stroke="#888888" 
                        domain={[0, 100]}
                        label={{ value: 'Symptom Score', angle: -90, position: 'insideLeft', fill: '#888888' }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#888888"
                        domain={[0, 10]}
                        label={{ value: 'Activities', angle: 90, position: 'insideRight', fill: '#888888' }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#333333', borderColor: '#444444' }}
                      />
                      <Legend />
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="symptomScore" 
                        name="Symptom Score" 
                        fill="#6E40C9" 
                        stroke="#6E40C9"
                        fillOpacity={0.2}
                      />
                      <Bar 
                        yAxisId="right"
                        dataKey="activities" 
                        name="Activity Level" 
                        fill="#10B981" 
                        radius={[4, 4, 0, 0]}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Recovery Insights */}
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recovery Pattern Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-neutral-700 rounded-md">
                    <h3 className="text-sm font-medium mb-2 text-primary">Recovery Patterns by Subgroup</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-neutral-300">
                      <li><span className="font-medium">Sport-related injuries:</span> Typically 21-28 days to symptom resolution</li>
                      <li><span className="font-medium">MVA-related injuries:</span> Typically 28-42 days to symptom resolution</li>
                      <li><span className="font-medium">Patients with LOC history:</span> 18% longer recovery time than those without</li>
                      <li><span className="font-medium">Patients with previous concussions:</span> 25% longer recovery time per previous injury</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border border-neutral-700 rounded-md">
                    <h3 className="text-sm font-medium mb-2 text-primary">Functional Improvement Milestones</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-neutral-300">
                      <li><span className="font-medium">Headache resolution:</span> Typically occurs by day 14-21</li>
                      <li><span className="font-medium">Cognitive symptom improvement:</span> Most significant between days 7-28</li>
                      <li><span className="font-medium">Balance/dizziness recovery:</span> Typically resolves by day 10-14 with therapy</li>
                      <li><span className="font-medium">Return to full activities:</span> 85% of patients by day 42</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            {/* Clinical Treatment Recommendations */}
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Evidence-Based Clinical Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clinicalRecommendations.map((rec) => (
                    <div 
                      key={rec.id}
                      className="p-4 border border-neutral-700 rounded-md hover:border-primary transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{rec.title}</h3>
                        <Badge 
                          variant={rec.efficacy === 'High' ? 'default' : 'secondary'}
                          className="ml-2"
                        >
                          {rec.efficacy} Efficacy
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-400">
                        Recommended for: {rec.applicability}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Predictive Analytics */}
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Treatment Outcome Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border border-neutral-700 rounded-md">
                  <h3 className="text-sm font-medium mb-3 text-primary">Precision Medicine Approach</h3>
                  <p className="text-sm text-neutral-300 mb-4">
                    Based on current patient data, our predictive model suggests these targeted approaches 
                    for optimized recovery outcomes:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-status-green mr-2" />
                      <span className="text-sm">72% of patients respond best to early vestibular therapy when dizziness is reported</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-status-green mr-2" />
                      <span className="text-sm">85% show improved cognitive recovery with scheduled cognitive rest periods</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-status-yellow mr-2" />
                      <span className="text-sm">64% with sleep disturbances benefit from sleep hygiene interventions</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-status-yellow mr-2" />
                      <span className="text-sm">58% with emotional symptoms show improvement with CBT approaches</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}