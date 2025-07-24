import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from 'recharts';
import { cn } from '@/lib/utils';

// Define the different symptom categories
const CATEGORIES = {
  PHYSICAL: 'Physical Symptoms',
  COGNITIVE: 'Cognitive Symptoms',
  EMOTIONAL: 'Emotional Symptoms',
  SLEEP: 'Sleep Symptoms',
  NEUROLOGICAL: 'Neurological Symptoms'
};

// Michael Thompson symptom data across 3 visits
const symptomData = {
  visit1Date: '02-21-2025',
  visit2Date: '03-07-2025',
  visit3Date: '03-21-2025',
  symptoms: [
    // Physical Symptoms
    { id: 1, name: 'Headache', category: CATEGORIES.PHYSICAL, visit1: 5, visit2: 4, visit3: 2, maxScore: 6 },
    { id: 2, name: 'Pressure in Head', category: CATEGORIES.PHYSICAL, visit1: 5, visit2: 3, visit3: 2, maxScore: 6 },
    { id: 3, name: 'Neck Pain', category: CATEGORIES.PHYSICAL, visit1: 6, visit2: 4, visit3: 3, maxScore: 6 },
    { id: 4, name: 'Nausea/Vomiting', category: CATEGORIES.PHYSICAL, visit1: 3, visit2: 1, visit3: 0, maxScore: 6 },
    { id: 5, name: 'Dizziness', category: CATEGORIES.PHYSICAL, visit1: 4, visit2: 3, visit3: 1, maxScore: 6 },
    { id: 6, name: 'Blurred Vision', category: CATEGORIES.PHYSICAL, visit1: 3, visit2: 2, visit3: 0, maxScore: 6 },
    { id: 7, name: 'Balance Problems', category: CATEGORIES.PHYSICAL, visit1: 4, visit2: 3, visit3: 1, maxScore: 6 },
    { id: 8, name: 'Sensitivity to Light', category: CATEGORIES.PHYSICAL, visit1: 5, visit2: 4, visit3: 2, maxScore: 6 },
    { id: 9, name: 'Sensitivity to Noise', category: CATEGORIES.PHYSICAL, visit1: 4, visit2: 3, visit3: 2, maxScore: 6 },
    
    // Cognitive Symptoms
    { id: 10, name: 'Feeling Slowed Down', category: CATEGORIES.COGNITIVE, visit1: 5, visit2: 4, visit3: 2, maxScore: 6 },
    { id: 11, name: 'Feeling in a Fog', category: CATEGORIES.COGNITIVE, visit1: 4, visit2: 3, visit3: 1, maxScore: 6 },
    { id: 12, name: 'Difficulty Concentrating', category: CATEGORIES.COGNITIVE, visit1: 5, visit2: 4, visit3: 3, maxScore: 6 },
    { id: 13, name: 'Difficulty Remembering', category: CATEGORIES.COGNITIVE, visit1: 4, visit2: 3, visit3: 2, maxScore: 6 },
    { id: 14, name: 'Confusion', category: CATEGORIES.COGNITIVE, visit1: 3, visit2: 2, visit3: 1, maxScore: 6 },
    { id: 15, name: 'Word Finding Difficulties', category: CATEGORIES.COGNITIVE, visit1: 2, visit2: 1, visit3: 0, maxScore: 6 },
    { id: 16, name: 'Planning/Organizing Issues', category: CATEGORIES.COGNITIVE, visit1: 5, visit2: 4, visit3: 2, maxScore: 6 },
    
    // Emotional Symptoms
    { id: 17, name: 'More Emotional', category: CATEGORIES.EMOTIONAL, visit1: 3, visit2: 4, visit3: 2, maxScore: 6 },
    { id: 18, name: 'Irritability', category: CATEGORIES.EMOTIONAL, visit1: 4, visit2: 4, visit3: 2, maxScore: 6 },
    { id: 19, name: 'Sadness/Depression', category: CATEGORIES.EMOTIONAL, visit1: 3, visit2: 4, visit3: 2, maxScore: 6 },
    { id: 20, name: 'Nervous/Anxious', category: CATEGORIES.EMOTIONAL, visit1: 2, visit2: 4, visit3: 3, maxScore: 6 },
    { id: 21, name: 'Personality Changes', category: CATEGORIES.EMOTIONAL, visit1: 5, visit2: 4, visit3: 2, maxScore: 6 },
    
    // Sleep Symptoms
    { id: 22, name: 'Trouble Falling Asleep', category: CATEGORIES.SLEEP, visit1: 5, visit2: 4, visit3: 3, maxScore: 6 },
    { id: 23, name: 'Drowsiness', category: CATEGORIES.SLEEP, visit1: 4, visit2: 3, visit3: 2, maxScore: 6 },
    { id: 24, name: 'Fatigue/Low Energy', category: CATEGORIES.SLEEP, visit1: 5, visit2: 4, visit3: 2, maxScore: 6 },
    
    // Neurological Symptoms
    { id: 25, name: 'Gait/Balance Problems', category: CATEGORIES.NEUROLOGICAL, visit1: 5, visit2: 4, visit3: 2, maxScore: 6 },
    { id: 26, name: 'Vision Loss/Change', category: CATEGORIES.NEUROLOGICAL, visit1: 5, visit2: 4, visit3: 3, maxScore: 6 },
    { id: 27, name: 'Hearing Loss/Change', category: CATEGORIES.NEUROLOGICAL, visit1: 4, visit2: 3, visit3: 1, maxScore: 6 },
    { id: 28, name: 'Loss of Smell/Taste', category: CATEGORIES.NEUROLOGICAL, visit1: 3, visit2: 2, visit3: 1, maxScore: 6 },
  ]
};

// Define Category Average type
type CategoryAverage = {
  name: string;
  visit1: number;
  visit2: number;
  visit3: number;
  maxScore: number;
};

// Calculate averages for each category per visit
const calculateCategoryAverages = (): CategoryAverage[] => {
  const categories = Object.values(CATEGORIES);
  const result: CategoryAverage[] = [];
  
  categories.forEach(category => {
    const categorySymptoms = symptomData.symptoms.filter(s => s.category === category);
    if (categorySymptoms.length === 0) return;
    
    const visit1Avg = categorySymptoms.reduce((sum, s) => sum + s.visit1, 0) / categorySymptoms.length;
    const visit2Avg = categorySymptoms.reduce((sum, s) => sum + s.visit2, 0) / categorySymptoms.length;
    const visit3Avg = categorySymptoms.reduce((sum, s) => sum + s.visit3, 0) / categorySymptoms.length;
    
    result.push({
      name: category,
      visit1: parseFloat(visit1Avg.toFixed(1)),
      visit2: parseFloat(visit2Avg.toFixed(1)),
      visit3: parseFloat(visit3Avg.toFixed(1)),
      maxScore: 6
    });
  });
  
  return result;
};

// Calculate total scores for each visit
const calculateTotalScores = () => {
  const visit1Total = symptomData.symptoms.reduce((sum, s) => sum + s.visit1, 0);
  const visit2Total = symptomData.symptoms.reduce((sum, s) => sum + s.visit2, 0);
  const visit3Total = symptomData.symptoms.reduce((sum, s) => sum + s.visit3, 0);
  const maxPossible = symptomData.symptoms.length * 6; // 6 is max score per symptom
  
  return {
    visit1: { score: visit1Total, percentage: (visit1Total / maxPossible) * 100 },
    visit2: { score: visit2Total, percentage: (visit2Total / maxPossible) * 100 },
    visit3: { score: visit3Total, percentage: (visit3Total / maxPossible) * 100 },
    maxPossible
  };
};

// Prepare data for radar chart with simplified category names, trend indicators, and interactive drill-down
const prepareRadarData = () => {
  const categoryAverages = calculateCategoryAverages();
  
  // Helper function to get simplified category name
  const getSimplifiedName = (fullName: string): string => {
    if (fullName.includes('Physical')) return 'Physical';
    if (fullName.includes('Cognitive')) return 'Cognitive';
    if (fullName.includes('Emotional')) return 'Emotional';
    if (fullName.includes('Sleep')) return 'Sleep';
    if (fullName.includes('Neurological')) return 'Neurological';
    return fullName;
  };
  
  // Helper function to calculate trend from previous visit
  const calculateTrend = (currentValue: number, previousValue: number): string => {
    const change = currentValue - previousValue;
    if (change < 0) return `▼ ${change.toFixed(1)}`; // Decreasing (improvement)
    if (change > 0) return `▲ +${change.toFixed(1)}`; // Increasing (worsening)
    return '● 0'; // No change
  };
  
  // Helper function to calculate color based on trend
  const getTrendColor = (currentValue: number, previousValue: number): string => {
    const change = currentValue - previousValue;
    if (change < 0) return '#4bb385'; // Green for improvement
    if (change > 0) return '#e60000'; // Red for worsening
    return '#ffdc72'; // Yellow for no change
  };
  
  // Helper function to get drill-down data (symptoms within this category)
  const getDrillDownData = (categoryName: string) => {
    const fullName = Object.values(CATEGORIES).find(cat => 
      getSimplifiedName(cat) === categoryName) || '';
    
    return symptomData.symptoms
      .filter(s => s.category === fullName)
      .map(s => ({
        name: s.name,
        visit1: s.visit1,
        visit2: s.visit2,
        visit3: s.visit3,
        v1ToV2Change: s.visit2 - s.visit1,
        v2ToV3Change: s.visit3 - s.visit2,
        trend: s.visit3 - s.visit1
      }));
  };
  
  // Calculate weeks between visits
  const calculateWeeksBetween = (date1: string, date2: string): number => {
    const [month1, day1, year1] = date1.split('-').map(Number);
    const [month2, day2, year2] = date2.split('-').map(Number);
    
    const d1 = new Date(year1, month1 - 1, day1);
    const d2 = new Date(year2, month2 - 1, day2);
    
    // Calculate difference in milliseconds and convert to weeks
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    return diffWeeks;
  };
  
  const weeksBetweenV1V2 = calculateWeeksBetween(symptomData.visit1Date, symptomData.visit2Date);
  const weeksBetweenV2V3 = calculateWeeksBetween(symptomData.visit2Date, symptomData.visit3Date);
  const totalWeeks = calculateWeeksBetween(symptomData.visit1Date, symptomData.visit3Date);
  
  // Combined radar data with all visits and trends
  const combinedData = categoryAverages.map(cat => {
    const simpleName = getSimplifiedName(cat.name);
    return {
      subject: simpleName,
      visit1: cat.visit1,
      visit2: cat.visit2,
      visit3: cat.visit3,
      v1ToV2Trend: calculateTrend(cat.visit2, cat.visit1),
      v2ToV3Trend: calculateTrend(cat.visit3, cat.visit2),
      v1ToV2Color: getTrendColor(cat.visit2, cat.visit1),
      v2ToV3Color: getTrendColor(cat.visit3, cat.visit2),
      trend: calculateTrend(cat.visit3, cat.visit1),
      trendColor: getTrendColor(cat.visit3, cat.visit1),
      drillDown: getDrillDownData(simpleName),
      fullMark: cat.maxScore,
    };
  });
  
  // Radar data for visit 1
  const visit1Data = combinedData.map(item => ({
    ...item,
    A: item.visit1,
  }));
  
  // Radar data for visit 2
  const visit2Data = combinedData.map(item => ({
    ...item,
    A: item.visit2,
  }));
  
  // Radar data for visit 3
  const visit3Data = combinedData.map(item => ({
    ...item,
    A: item.visit3,
  }));
  
  return { 
    visit1Data, 
    visit2Data, 
    visit3Data, 
    combinedData,
    visitDates: {
      visit1Date: symptomData.visit1Date,
      visit2Date: symptomData.visit2Date,
      visit3Date: symptomData.visit3Date,
      weeksBetweenV1V2,
      weeksBetweenV2V3,
      totalWeeks
    }
  };
};

// Prepare data for heatmap with trend indicators
const prepareHeatmapData = () => {
  return symptomData.symptoms.map(symptom => {
    const v1ToV2Change = symptom.visit2 - symptom.visit1;
    const v2ToV3Change = symptom.visit3 - symptom.visit2;
    const overallChange = symptom.visit3 - symptom.visit1;
    
    // Generate trend symbols and colors
    const v1ToV2Trend = v1ToV2Change < 0 ? `▼ ${v1ToV2Change}` : v1ToV2Change > 0 ? `▲ +${v1ToV2Change}` : '● 0';
    const v2ToV3Trend = v2ToV3Change < 0 ? `▼ ${v2ToV3Change}` : v2ToV3Change > 0 ? `▲ +${v2ToV3Change}` : '● 0';
    const overallTrend = overallChange < 0 ? `▼ ${overallChange}` : overallChange > 0 ? `▲ +${overallChange}` : '● 0';
    
    // Color trends based on improvement (green) or worsening (red)
    const v1ToV2Color = v1ToV2Change < 0 ? '#4bb385' : v1ToV2Change > 0 ? '#e60000' : '#ffdc72';
    const v2ToV3Color = v2ToV3Change < 0 ? '#4bb385' : v2ToV3Change > 0 ? '#e60000' : '#ffdc72';
    const overallColor = overallChange < 0 ? '#4bb385' : overallChange > 0 ? '#e60000' : '#ffdc72';
    
    return {
      name: symptom.name,
      visit1: symptom.visit1,
      visit2: symptom.visit2,
      visit3: symptom.visit3,
      category: symptom.category,
      v1ToV2Change,
      v2ToV3Change,
      overallChange,
      v1ToV2Trend,
      v2ToV3Trend,
      overallTrend,
      v1ToV2Color,
      v2ToV3Color,
      overallColor
    };
  });
};

// Color scale for severity (0-6)
const getSeverityColor = (value: number) => {
  if (value === 0) return '#e5e5e5'; // Gray for no symptoms
  if (value === 1) return '#c6e5b3'; // Light green
  if (value === 2) return '#a3d86c'; // Green
  if (value === 3) return '#ffdc72'; // Yellow
  if (value === 4) return '#ffa64d'; // Orange
  if (value === 5) return '#ff704d'; // Light red
  if (value === 6) return '#e60000'; // Red
  return '#e5e5e5';
};

export function PatientVisitAnalytics() {
  const [activeView, setActiveView] = useState('summary');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.PHYSICAL);
  const [selectedRadarCategory, setSelectedRadarCategory] = useState('');
  const [showDrillDown, setShowDrillDown] = useState(false);
  
  const categoryAverages = calculateCategoryAverages();
  const totalScores = calculateTotalScores();
  const { visit1Data, visit2Data, visit3Data, combinedData, visitDates } = prepareRadarData();
  const heatmapData = prepareHeatmapData();
  
  // Filter symptoms by selected category
  const filteredSymptoms = symptomData.symptoms.filter(s => s.category === selectedCategory);
  
  // Handle radar category selection for drill-down
  const handleRadarCategoryClick = (category: string | undefined) => {
    if (category) {
      setSelectedRadarCategory(category);
      setShowDrillDown(true);
    }
  };
  
  // Get drill-down data for selected radar category if active
  const drillDownData = selectedRadarCategory ? 
    visit3Data.find(item => item.subject === selectedRadarCategory)?.drillDown || [] 
    : [];
  
  return (
    <Card className="w-full bg-background border-none shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-3xl font-semibold text-primary-light">
                Symptom Progression Analysis
              </CardTitle>
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                <span>{visitDates.totalWeeks} weeks</span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Improving</span>
              </div>
            </div>
            <CardDescription className="text-lg mt-1 text-foreground/80">
              Track symptom changes across three clinical visits
            </CardDescription>
          </div>
          <div className="flex flex-col items-end mt-2 md:mt-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <p className="text-lg font-medium">
                Michael Thompson
              </p>
            </div>
            <div className="mt-1 px-2 py-1 bg-neutral-800 rounded text-sm">
              <span className="text-neutral-400">Period:</span> {symptomData.visit1Date} to {symptomData.visit3Date}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="summary" onValueChange={setActiveView} className="w-full">
          <TabsList className="flex space-x-1 bg-muted p-1 rounded-md mb-6">
            <TabsTrigger value="summary" className="flex-1 py-3 text-lg rounded-md data-[state=active]:bg-background data-[state=active]:text-primary-light data-[state=active]:shadow-sm">Summary</TabsTrigger>
            <TabsTrigger value="categories" className="flex-1 py-3 text-lg rounded-md data-[state=active]:bg-background data-[state=active]:text-primary-light data-[state=active]:shadow-sm">By Category</TabsTrigger>
            <TabsTrigger value="radar" className="flex-1 py-3 text-lg rounded-md data-[state=active]:bg-background data-[state=active]:text-primary-light data-[state=active]:shadow-sm">Radar Analysis</TabsTrigger>
            <TabsTrigger value="heatmap" className="flex-1 py-3 text-lg rounded-md data-[state=active]:bg-background data-[state=active]:text-primary-light data-[state=active]:shadow-sm">Symptom Heatmap</TabsTrigger>
          </TabsList>
          
          {/* Summary View */}
          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 mt-2">
              {/* Total Score Card */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-2xl font-medium text-primary">Total Symptom Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-around items-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary">
                        {totalScores.visit1.score} 
                        <span className="text-lg font-normal text-muted-foreground"> / {totalScores.maxPossible}</span>
                      </div>
                      <div className="text-lg text-primary mt-2">Visit 1</div>
                    </div>
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary">
                        {totalScores.visit2.score}
                        <span className="text-lg font-normal text-muted-foreground"> / {totalScores.maxPossible}</span>
                      </div>
                      <div className="text-lg text-primary mt-2">Visit 2</div>
                    </div>
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary">
                        {totalScores.visit3.score}
                        <span className="text-lg font-normal text-muted-foreground"> / {totalScores.maxPossible}</span>
                      </div>
                      <div className="text-lg text-primary mt-2">Visit 3</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={[
                        { name: 'Visit 1', score: totalScores.visit1.score },
                        { name: 'Visit 2', score: totalScores.visit2.score },
                        { name: 'Visit 3', score: totalScores.visit3.score },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, totalScores.maxPossible]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#154734" 
                          strokeWidth={2} 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Category Averages Preview */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">Category Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart 
                      data={categoryAverages}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 6]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="visit1" name="Visit 1" fill="#154734" />
                      <Bar dataKey="visit2" name="Visit 2" fill="#2a8c5c" />
                      <Bar dataKey="visit3" name="Visit 3" fill="#4bb385" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* By Category View */}
          <TabsContent value="categories">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.values(CATEGORIES).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-3 py-1 text-sm rounded-full transition-colors",
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-primary/10"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">{selectedCategory} Detail</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={filteredSymptoms}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 6]} />
                      <YAxis type="category" dataKey="name" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="visit1" name="Visit 1" fill="#154734" />
                      <Bar dataKey="visit2" name="Visit 2" fill="#2a8c5c" />
                      <Bar dataKey="visit3" name="Visit 3" fill="#4bb385" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Radar Analysis View */}
          <TabsContent value="radar">
            <div className="w-full">
              <Card className="bg-card border-none shadow-md mb-4">
                <CardHeader className="py-3 flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-medium text-foreground">Symptom Category Radar Analysis</CardTitle>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#154734" }}></span>
                        <span className="text-xs">Initial Visit</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#2a8c5c" }}></span>
                        <span className="text-xs">Follow-up ({visitDates.weeksBetweenV1V2}w)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#4bb385" }}></span>
                        <span className="text-xs">Current ({visitDates.totalWeeks}w)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm text-muted-foreground">Click on a category to view detailed symptoms</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">▼ Improvement</div>
                      <div className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">▲ Worsening</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!showDrillDown ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="flex flex-col items-center">
                            <h3 className="text-center text-lg font-medium mb-1">Visit 1</h3>
                            <p className="text-sm text-muted-foreground mb-2">{visitDates.visit1Date}</p>
                          </div>
                          <ResponsiveContainer width={300} height={300}>
                            <RadarChart data={visit1Data} margin={{ top: 50, right: 75, left: 75, bottom: 50 }}>
                              <PolarGrid stroke="#444" />
                              <PolarAngleAxis 
                                dataKey="subject" 
                                tick={{ fill: '#ffffff', fontSize: 14, fontWeight: 'bold' }}
                                stroke="#ffffff"
                                axisLine={{ strokeWidth: 2 }}
                                tickLine={false}
                                dy={5}
                              />
                              <PolarRadiusAxis 
                                domain={[0, 6]} 
                                tick={{ fill: '#ccc' }}
                                stroke="#666"
                              />
                              <Radar 
                                name="Symptom Level" 
                                dataKey="A" 
                                stroke="#154734" 
                                fill="#154734" 
                                fillOpacity={0.6} 
                                strokeWidth={2}
                              />
                              <Tooltip 
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className="bg-background p-2 border border-neutral-700 rounded shadow-md">
                                        <p className="font-bold">{data.subject}: {data.A}</p>
                                        <p className="text-xs">Initial assessment</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>

                        <div>
                          <div className="flex flex-col items-center">
                            <h3 className="text-center text-lg font-medium mb-1">Visit 2</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {visitDates.visit2Date}
                              <span className="ml-2 text-xs px-2 py-1 bg-primary/10 rounded-full">
                                + {visitDates.weeksBetweenV1V2} weeks
                              </span>
                            </p>
                          </div>
                          <div className="relative">
                            <ResponsiveContainer width={300} height={300}>
                              <RadarChart data={visit2Data} margin={{ top: 50, right: 75, left: 75, bottom: 50 }}>
                                <PolarGrid stroke="#444" />
                                <PolarAngleAxis 
                                  dataKey="subject" 
                                  tick={{ fill: '#ffffff', fontSize: 14, fontWeight: 'bold' }}
                                  stroke="#ffffff"
                                  axisLine={{ strokeWidth: 2 }}
                                  tickLine={false}
                                  dy={5}
                                />
                                <PolarRadiusAxis 
                                  domain={[0, 6]} 
                                  tick={{ fill: '#ccc' }}
                                  stroke="#666"
                                />
                                <Radar 
                                  name="Symptom Level" 
                                  dataKey="A" 
                                  stroke="#2a8c5c" 
                                  fill="#2a8c5c" 
                                  fillOpacity={0.6} 
                                  strokeWidth={2}
                                />
                                <Tooltip 
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="bg-background p-2 border border-neutral-700 rounded shadow-md">
                                          <p className="font-bold">{data.subject}: {data.A}</p>
                                          <p className="text-sm">Change from Visit 1: <span style={{ color: data.v1ToV2Color }}>{data.v1ToV2Trend}</span></p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                            
                            {/* Overlay trend indicators positioned outside the graph data area */}
                            <div className="absolute inset-0 pointer-events-none">
                              {visit2Data.map((item, index) => {
                                // Calculate positions outside the main data area
                                const angles = [0, 72, 144, 216, 288];
                                const angle = angles[index] * (Math.PI / 180);
                                const radius = 135; // Further out to avoid blocking data
                                const centerX = 150;
                                const centerY = 150;
                                
                                const x = centerX + radius * Math.sin(angle);
                                const y = centerY - radius * Math.cos(angle);
                                
                                return (
                                  <div 
                                    key={`overlay-v2-${index}`}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                    style={{ left: `${x}px`, top: `${y}px` }}
                                  >
                                    <div 
                                      className="text-xs font-bold px-1 py-0.5 rounded shadow-sm"
                                      style={{ 
                                        color: item.v1ToV2Color,
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        border: `1px solid ${item.v1ToV2Color}`,
                                        fontSize: '10px'
                                      }}
                                    >
                                      {item.v1ToV2Trend}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                        
                        <div>
                          <div className="flex flex-col items-center">
                            <h3 className="text-center text-lg font-medium mb-1">Visit 3 (Current)</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {visitDates.visit3Date}
                              <span className="ml-2 text-xs px-2 py-1 bg-primary/10 rounded-full">
                                + {visitDates.weeksBetweenV2V3} weeks
                              </span>
                            </p>
                          </div>
                          <div className="relative">
                            <ResponsiveContainer width={300} height={300}>
                              <RadarChart 
                                data={visit3Data} 
                                margin={{ top: 50, right: 75, left: 75, bottom: 50 }}
                                onClick={(data: any) => data && data.activeLabel && handleRadarCategoryClick(data.activeLabel)}
                              >
                                <PolarGrid stroke="#444" />
                                <PolarAngleAxis 
                                  dataKey="subject" 
                                  tick={{ fill: '#ffffff', fontSize: 14, fontWeight: 'bold' }}
                                  stroke="#ffffff"
                                  axisLine={{ strokeWidth: 2 }}
                                  tickLine={false}
                                  dy={5}
                                />
                                <PolarRadiusAxis 
                                  domain={[0, 6]} 
                                  tick={{ fill: '#ccc' }}
                                  stroke="#666"
                                />
                                <Radar 
                                  name="Symptom Level" 
                                  dataKey="A" 
                                  stroke="#4bb385" 
                                  fill="#4bb385" 
                                  fillOpacity={0.6} 
                                  strokeWidth={2}
                                  activeDot={{ r: 8, onClick: () => {} }}
                                />
                                <Tooltip 
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="bg-background p-2 border border-neutral-700 rounded shadow-md">
                                          <p className="font-bold">{data.subject}: {data.A}</p>
                                          <p className="text-sm">Change from Visit 2: <span style={{ color: data.v2ToV3Color }}>{data.v2ToV3Trend}</span></p>
                                          <p className="text-sm">Overall change: <span style={{ color: data.trendColor }}>{data.trend}</span></p>
                                          <p className="text-xs mt-1">Click to view detailed symptoms</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                            
                            {/* Overlay trend indicators positioned outside the graph data area */}
                            <div className="absolute inset-0">
                              {visit3Data.map((item, index) => {
                                // Calculate positions outside the main data area
                                const angles = [0, 72, 144, 216, 288];
                                const angle = angles[index] * (Math.PI / 180);
                                const radius = 135; // Further out to avoid blocking data
                                const centerX = 150;
                                const centerY = 150;
                                
                                const x = centerX + radius * Math.sin(angle);
                                const y = centerY - radius * Math.cos(angle);
                                
                                return (
                                  <div 
                                    key={`overlay-v3-${index}`}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:opacity-80"
                                    style={{ left: `${x}px`, top: `${y}px` }}
                                    onClick={() => handleRadarCategoryClick(item.subject)}
                                  >
                                    <div 
                                      className="text-xs font-bold px-1 py-0.5 rounded shadow-sm"
                                      style={{ 
                                        color: item.v2ToV3Color,
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        border: `1px solid ${item.v2ToV3Color}`,
                                        fontSize: '10px'
                                      }}
                                    >
                                      {item.v2ToV3Trend}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-2 mt-6">
                        {combinedData.map((item) => (
                          <div 
                            key={item.subject} 
                            className="flex items-center justify-center cursor-pointer hover:bg-primary/10 p-2 rounded"
                            onClick={() => handleRadarCategoryClick(item.subject)}
                          >
                            <span className="font-bold mr-1" style={{ color: item.trendColor }}>{item.trend}</span>
                            <span>{item.subject}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setShowDrillDown(false);
                              setSelectedRadarCategory('');
                            }}
                            className="mr-2"
                          >
                            Back to Overview
                          </Button>
                          <div>
                            <h3 className="text-xl font-medium">{selectedRadarCategory} Symptoms Detail</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Assessment period: {symptomData.visit1Date} to {symptomData.visit3Date} ({visitDates.totalWeeks} weeks)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                            <span className="text-xs">Significant Improvement (≥3)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-teal-400 mr-1"></div>
                            <span className="text-xs">Mild Improvement (1-2)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                            <span className="text-xs">No Change</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                            <span className="text-xs">Needs Attention (≥1)</span>
                          </div>
                          <Button size="sm" variant="outline" className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export Data
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {drillDownData.map((symptom, idx) => (
                          <div key={idx} className={`border ${symptom.trend < 0 && Math.abs(symptom.trend) >= 3 ? 'border-green-700' : symptom.trend > 0 ? 'border-red-700' : 'border-neutral-700'} rounded-md overflow-hidden`}>
                            <div className="p-3 border-b border-neutral-800">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-medium">{symptom.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    {symptom.visit3 >= 5 && (
                                      <div className="text-xs px-2 py-0.5 rounded-full bg-red-900/30 text-red-400">
                                        Severe
                                      </div>
                                    )}
                                    {symptom.visit3 >= 3 && symptom.visit3 < 5 && (
                                      <div className="text-xs px-2 py-0.5 rounded-full bg-orange-900/30 text-orange-400">
                                        Moderate
                                      </div>
                                    )}
                                    {symptom.visit3 > 0 && symptom.visit3 < 3 && (
                                      <div className="text-xs px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400">
                                        Mild
                                      </div>
                                    )}
                                    {symptom.visit3 === 0 && (
                                      <div className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400">
                                        Resolved
                                      </div>
                                    )}
                                    
                                    {symptom.trend < 0 && Math.abs(symptom.trend) >= 3 && (
                                      <div className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400">
                                        Clinically Significant Improvement
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div 
                                  className="text-sm px-2 py-1 rounded-full" 
                                  style={{ 
                                    backgroundColor: symptom.trend < 0 ? 'rgba(75, 179, 133, 0.2)' : symptom.trend > 0 ? 'rgba(230, 0, 0, 0.2)' : 'rgba(255, 220, 114, 0.2)',
                                    color: symptom.trend < 0 ? '#4bb385' : symptom.trend > 0 ? '#e60000' : '#ffdc72'
                                  }}
                                >
                                  {symptom.trend < 0 ? `Improved (${symptom.trend})` : symptom.trend > 0 ? `Worsened (+${Math.abs(symptom.trend)})` : 'No Change'}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2 mb-2">
                                <div className="text-center p-2 bg-neutral-800 rounded-md relative">
                                  <p className="text-xs text-neutral-400 mb-1">Visit 1</p>
                                  <p className="text-lg font-bold">{symptom.visit1}/6</p>
                                  <p className="text-xs text-neutral-400 mt-1">{symptomData.visit1Date}</p>
                                </div>
                                <div className="text-center p-2 bg-neutral-800 rounded-md relative">
                                  <div className="absolute -top-3 left-0 right-0 flex justify-center">
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" 
                                          style={{ 
                                            backgroundColor: symptom.visit2 - symptom.visit1 < 0 ? 'rgba(75, 179, 133, 0.2)' : 
                                                           symptom.visit2 - symptom.visit1 > 0 ? 'rgba(230, 0, 0, 0.2)' : 
                                                           'rgba(255, 220, 114, 0.2)',
                                            color: symptom.visit2 - symptom.visit1 < 0 ? '#4bb385' : 
                                                   symptom.visit2 - symptom.visit1 > 0 ? '#e60000' : 
                                                   '#ffdc72' 
                                          }}>
                                      {symptom.visit2 - symptom.visit1 < 0 ? `▼ ${symptom.visit2 - symptom.visit1}` : 
                                       symptom.visit2 - symptom.visit1 > 0 ? `▲ +${symptom.visit2 - symptom.visit1}` : 
                                       '● 0'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-neutral-400 mb-1">Visit 2 <span className="text-xs">+{visitDates.weeksBetweenV1V2}w</span></p>
                                  <p className="text-lg font-bold">{symptom.visit2}/6</p>
                                  <p className="text-xs text-neutral-400 mt-1">{symptomData.visit2Date}</p>
                                </div>
                                <div className="text-center p-2 bg-neutral-800 rounded-md relative">
                                  <div className="absolute -top-3 left-0 right-0 flex justify-center">
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" 
                                          style={{ 
                                            backgroundColor: symptom.visit3 - symptom.visit2 < 0 ? 'rgba(75, 179, 133, 0.2)' : 
                                                           symptom.visit3 - symptom.visit2 > 0 ? 'rgba(230, 0, 0, 0.2)' : 
                                                           'rgba(255, 220, 114, 0.2)',
                                            color: symptom.visit3 - symptom.visit2 < 0 ? '#4bb385' : 
                                                   symptom.visit3 - symptom.visit2 > 0 ? '#e60000' : 
                                                   '#ffdc72' 
                                          }}>
                                      {symptom.visit3 - symptom.visit2 < 0 ? `▼ ${symptom.visit3 - symptom.visit2}` : 
                                       symptom.visit3 - symptom.visit2 > 0 ? `▲ +${symptom.visit3 - symptom.visit2}` : 
                                       '● 0'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-neutral-400 mb-1">Visit 3 <span className="text-xs">+{visitDates.weeksBetweenV2V3}w</span></p>
                                  <p className="text-lg font-bold">{symptom.visit3}/6</p>
                                  <p className="text-xs text-neutral-400 mt-1">{symptomData.visit3Date}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-neutral-900 p-3">
                              <div className="mb-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-neutral-400">Treatment Progress:</span>
                                  <span className="text-xs font-medium">
                                    {Math.round((1 - symptom.visit3/6) * 100)}% recovery
                                  </span>
                                </div>
                                <div className="w-full bg-neutral-800 h-2.5 rounded-full mt-1 overflow-hidden">
                                  <div 
                                    className="h-full rounded-full transition-all" 
                                    style={{ 
                                      width: `${(1 - symptom.visit3/6) * 100}%`,
                                      backgroundColor: symptom.visit3 === 0 ? '#4ade80' :
                                                      symptom.visit3 <= 2 ? '#22c55e' :
                                                      symptom.visit3 <= 4 ? '#eab308' : '#ef4444'
                                    }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="text-xs text-neutral-400 mt-3">
                                {symptom.trend < 0 && symptom.visit3 <= 2 && (
                                  <div className="flex items-center gap-1 text-green-400 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                    <span>Good progress on recovery trajectory</span>
                                  </div>
                                )}
                                {symptom.trend < 0 && symptom.visit3 > 2 && (
                                  <div className="flex items-center gap-1 text-blue-400 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                    <span>Improving but continue monitoring</span>
                                  </div>
                                )}
                                {symptom.trend > 0 && (
                                  <div className="flex items-center gap-1 text-red-400 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    <span>Consider treatment adjustment</span>
                                  </div>
                                )}
                                {symptom.trend === 0 && (
                                  <div className="flex items-center gap-1 text-yellow-400 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    <span>Stable - review intervention efficacy</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Heatmap View */}
          <TabsContent value="heatmap">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Symptom Severity Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left p-2 border-b">Symptom</th>
                        <th className="p-2 border-b text-center">Visit 1</th>
                        <th className="p-2 border-b text-center">Visit 2</th>
                        <th className="p-2 border-b text-center">Visit 3</th>
                        <th className="p-2 border-b text-left">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {symptomData.symptoms.map((symptom) => (
                        <tr key={symptom.id} className="hover:bg-muted/50">
                          <td className="p-2 border-b">{symptom.name}</td>
                          <td className="p-2 border-b text-center">
                            <div 
                              className="w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-medium text-white"
                              style={{ backgroundColor: getSeverityColor(symptom.visit1) }}
                            >
                              {symptom.visit1}
                            </div>
                          </td>
                          <td className="p-2 border-b text-center">
                            <div 
                              className="w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-medium text-white"
                              style={{ backgroundColor: getSeverityColor(symptom.visit2) }}
                            >
                              {symptom.visit2}
                            </div>
                          </td>
                          <td className="p-2 border-b text-center">
                            <div 
                              className="w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-medium text-white"
                              style={{ backgroundColor: getSeverityColor(symptom.visit3) }}
                            >
                              {symptom.visit3}
                            </div>
                          </td>
                          <td className="p-2 border-b text-xs">{symptom.category}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex items-center justify-center mt-4 gap-2">
                  <div className="text-xs text-muted-foreground">Severity Scale:</div>
                  {[0, 1, 2, 3, 4, 5, 6].map(value => (
                    <div key={value} className="flex flex-col items-center">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white"
                        style={{ backgroundColor: getSeverityColor(value) }}
                      >
                        {value}
                      </div>
                      <div className="text-[10px] mt-1">
                        {value === 0 ? 'None' : value === 6 ? 'Severe' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}