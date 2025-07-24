import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Badge } from '../ui/badge';
import { BarChart3, Brain, LineChart as LineChartIcon, Activity } from 'lucide-react';

interface DetailedSymptomProgressionProps {
  patientId: number;
  patientName: string;
}

export function DetailedSymptomProgression({ patientId, patientName }: DetailedSymptomProgressionProps) {
  // Using static data for Michael Thompson
  const visitDates = ['Jan 18, 2025', 'Feb 18, 2025', 'Mar 21, 2025'];
  
  // Physical symptoms
  const physicalSymptoms = [
    { name: 'Headache', visit1: 5, visit2: 3, visit3: 1 },
    { name: 'Nausea', visit1: 4, visit2: 2, visit3: 0 },
    { name: 'Balance Problems', visit1: 5, visit2: 3, visit3: 1 },
    { name: 'Dizziness', visit1: 4, visit2: 3, visit3: 1 },
    { name: 'Blurred Vision', visit1: 3, visit2: 2, visit3: 0 },
    { name: 'Light Sensitivity', visit1: 4, visit2: 3, visit3: 1 }
  ];
  
  // Cognitive symptoms
  const cognitiveSymptoms = [
    { name: 'Difficulty Concentrating', visit1: 5, visit2: 4, visit3: 2 },
    { name: 'Memory Problems', visit1: 4, visit2: 3, visit3: 2 },
    { name: 'Foggy Feeling', visit1: 5, visit2: 3, visit3: 1 },
    { name: 'Slowed Thinking', visit1: 4, visit2: 3, visit3: 2 }
  ];
  
  // Emotional symptoms
  const emotionalSymptoms = [
    { name: 'Irritability', visit1: 3, visit2: 2, visit3: 1 },
    { name: 'Sadness', visit1: 2, visit2: 2, visit3: 1 },
    { name: 'Anxiety', visit1: 4, visit2: 3, visit3: 2 },
    { name: 'Emotional Changes', visit1: 3, visit2: 2, visit3: 1 }
  ];
  
  // Sleep symptoms
  const sleepSymptoms = [
    { name: 'Trouble Falling Asleep', visit1: 4, visit2: 3, visit3: 2 },
    { name: 'Drowsiness', visit1: 3, visit2: 2, visit3: 1 },
    { name: 'Fatigue', visit1: 5, visit2: 3, visit3: 2 }
  ];
  
  // Calculate totals for each category across visits
  const categoryTotals = [
    { 
      name: 'Physical',
      visit1: physicalSymptoms.reduce((sum, s) => sum + s.visit1, 0),
      visit2: physicalSymptoms.reduce((sum, s) => sum + s.visit2, 0),
      visit3: physicalSymptoms.reduce((sum, s) => sum + s.visit3, 0),
      maxScore: physicalSymptoms.length * 6
    },
    { 
      name: 'Cognitive',
      visit1: cognitiveSymptoms.reduce((sum, s) => sum + s.visit1, 0),
      visit2: cognitiveSymptoms.reduce((sum, s) => sum + s.visit2, 0),
      visit3: cognitiveSymptoms.reduce((sum, s) => sum + s.visit3, 0),
      maxScore: cognitiveSymptoms.length * 6
    },
    { 
      name: 'Emotional',
      visit1: emotionalSymptoms.reduce((sum, s) => sum + s.visit1, 0),
      visit2: emotionalSymptoms.reduce((sum, s) => sum + s.visit2, 0),
      visit3: emotionalSymptoms.reduce((sum, s) => sum + s.visit3, 0),
      maxScore: emotionalSymptoms.length * 6
    },
    { 
      name: 'Sleep',
      visit1: sleepSymptoms.reduce((sum, s) => sum + s.visit1, 0),
      visit2: sleepSymptoms.reduce((sum, s) => sum + s.visit2, 0),
      visit3: sleepSymptoms.reduce((sum, s) => sum + s.visit3, 0),
      maxScore: sleepSymptoms.length * 6
    }
  ];
  
  // Prepare data for line chart (tracking progress over time)
  const progressionData = [
    {
      date: 'Visit 1',
      Physical: categoryTotals[0].visit1,
      Cognitive: categoryTotals[1].visit1,
      Emotional: categoryTotals[2].visit1,
      Sleep: categoryTotals[3].visit1
    },
    {
      date: 'Visit 2',
      Physical: categoryTotals[0].visit2,
      Cognitive: categoryTotals[1].visit2,
      Emotional: categoryTotals[2].visit2,
      Sleep: categoryTotals[3].visit2
    },
    {
      date: 'Visit 3',
      Physical: categoryTotals[0].visit3,
      Cognitive: categoryTotals[1].visit3,
      Emotional: categoryTotals[2].visit3,
      Sleep: categoryTotals[3].visit3
    }
  ];
  
  // Calculate total score for each visit
  const totalScores = [
    categoryTotals.reduce((sum, cat) => sum + cat.visit1, 0),
    categoryTotals.reduce((sum, cat) => sum + cat.visit2, 0),
    categoryTotals.reduce((sum, cat) => sum + cat.visit3, 0)
  ];
  
  // Format data for radar charts
  const radarDataVisit1 = [
    { subject: 'Headache', value: physicalSymptoms[0].visit1, fullMark: 6 },
    { subject: 'Dizziness', value: physicalSymptoms[3].visit1, fullMark: 6 },
    { subject: 'Concentration', value: cognitiveSymptoms[0].visit1, fullMark: 6 },
    { subject: 'Memory', value: cognitiveSymptoms[1].visit1, fullMark: 6 },
    { subject: 'Anxiety', value: emotionalSymptoms[2].visit1, fullMark: 6 },
    { subject: 'Sleep', value: sleepSymptoms[0].visit1, fullMark: 6 }
  ];
  
  const radarDataVisit3 = [
    { subject: 'Headache', value: physicalSymptoms[0].visit3, fullMark: 6 },
    { subject: 'Dizziness', value: physicalSymptoms[3].visit3, fullMark: 6 },
    { subject: 'Concentration', value: cognitiveSymptoms[0].visit3, fullMark: 6 },
    { subject: 'Memory', value: cognitiveSymptoms[1].visit3, fullMark: 6 },
    { subject: 'Anxiety', value: emotionalSymptoms[2].visit3, fullMark: 6 },
    { subject: 'Sleep', value: sleepSymptoms[0].visit3, fullMark: 6 }
  ];
  
  // Format normalized data for heatmap
  const categoryNormalized = categoryTotals.map(cat => ({
    name: cat.name,
    visit1Percent: Math.round((cat.visit1 / cat.maxScore) * 100),
    visit2Percent: Math.round((cat.visit2 / cat.maxScore) * 100),
    visit3Percent: Math.round((cat.visit3 / cat.maxScore) * 100),
    improvement: Math.round(((cat.visit1 - cat.visit3) / cat.visit1) * 100)
  }));
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              {patientName}'s Symptom Analytics
            </CardTitle>
            <CardDescription>
              Detailed analysis of symptom changes across visits
            </CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {Math.round(((totalScores[0] - totalScores[2]) / totalScores[0]) * 100)}% Improvement
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="progression">
          <TabsList className="mb-4">
            <TabsTrigger value="progression" className="flex items-center">
              <LineChartIcon className="h-4 w-4 mr-2" />
              Progression
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Category Breakdown
            </TabsTrigger>
            <TabsTrigger value="polygon" className="flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              Polygon Analysis
            </TabsTrigger>
          </TabsList>
          
          {/* Progression View */}
          <TabsContent value="progression">
            <div className="space-y-6">
              {/* Overall Score Progression */}
              <div className="dark:bg-neutral-800 p-4 rounded-lg bg-[#121212]">
                <h3 className="text-base font-medium mb-4">Overall Symptom Score Progression</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { date: 'Visit 1', score: totalScores[0] },
                        { date: 'Visit 2', score: totalScores[1] },
                        { date: 'Visit 3', score: totalScores[2] }
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 'auto']} />
                      <Tooltip formatter={(value) => [`${value} points`, 'Score']} />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {totalScores.map((score, i) => (
                    <div key={i} className="text-center">
                      <div className="text-sm text-muted-foreground">Visit {i+1}</div>
                      <div className="text-2xl font-bold">{score}</div>
                      <div className="text-xs text-muted-foreground">{visitDates[i]}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Category Progression Chart */}
              <div className="dark:bg-neutral-800 p-4 rounded-lg bg-[#121212]">
                <h3 className="text-base font-medium mb-4">Symptom Category Progression</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={progressionData}
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="Physical" 
                        stroke="#ff7300" 
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Cognitive" 
                        stroke="#387908" 
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Emotional" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Sleep" 
                        stroke="#82ca9d" 
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Category Breakdown View */}
          <TabsContent value="heatmap">
            <div className="space-y-6">
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
                <h3 className="text-base font-medium mb-4">Category Improvement Analysis</h3>
                <div className="space-y-6">
                  {categoryNormalized.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name} Symptoms</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {category.improvement}% Improvement
                        </Badge>
                      </div>
                      
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              Visit 1
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              {category.visit1Percent}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                          <div style={{ width: `${category.visit1Percent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                        </div>
                        
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-yellow-600">
                              Visit 2
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-yellow-600">
                              {category.visit2Percent}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
                          <div style={{ width: `${category.visit2Percent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-600"></div>
                        </div>
                        
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-green-600">
                              Visit 3
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-green-600">
                              {category.visit3Percent}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-green-200">
                          <div style={{ width: `${category.visit3Percent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Polygon Analysis View */}
          <TabsContent value="polygon">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
                <h3 className="text-base font-medium mb-4">Initial Assessment (Visit 1)</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={120} data={radarDataVisit1}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 6]} />
                      <Radar
                        name="Symptoms"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
                <h3 className="text-base font-medium mb-4">Current Status (Visit 3)</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={120} data={radarDataVisit3}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 6]} />
                      <Radar
                        name="Symptoms"
                        dataKey="value"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}