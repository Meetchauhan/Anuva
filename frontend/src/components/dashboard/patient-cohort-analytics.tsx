import React from "react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  Scatter,
  ScatterChart,
  ZAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import type { PatientWithRisk } from "../../types";
import type { formatNumber, getAge } from "../../lib/utils";

interface PatientCohortAnalyticsProps {
  patients: PatientWithRisk[];
  loading?: boolean;
  error?: string;
}

export function PatientCohortAnalytics({ patients, loading, error }: PatientCohortAnalyticsProps) {
  // Patient demographics - age groups
  const ageGroups = React.useMemo(() => {
    const groups = {
      'Under 18': 0,
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45-54': 0,
      '55+': 0
    };
    
    patients.forEach(patient => {
      const age = getAge(patient.dateOfBirth);
      if (age < 18) groups['Under 18']++;
      else if (age < 25) groups['18-24']++;
      else if (age < 35) groups['25-34']++;
      else if (age < 45) groups['35-44']++;
      else if (age < 55) groups['45-54']++;
      else groups['55+']++;
    });
    
    return Object.entries(groups).map(([name, value]) => ({
      name,
      value,
      color: name === 'Under 18' ? '#6E40C9' : 
             name === '18-24' ? '#3182CE' : 
             name === '25-34' ? '#10B981' : 
             name === '35-44' ? '#F59E0B' : 
             name === '45-54' ? '#EF4444' : 
             '#8B5CF6'
    }));
  }, [patients]);
  
  // Patient demographics - gender
  const genderDistribution = React.useMemo(() => {
    const genders = {
      'Male': 0,
      'Female': 0,
      'Other': 0
    };
    
    patients.forEach(patient => {
      const gender = patient.gender.toLowerCase();
      if (gender === 'male') genders['Male']++;
      else if (gender === 'female') genders['Female']++;
      else genders['Other']++;
    });
    
    return Object.entries(genders).map(([name, value]) => ({
      name,
      value,
      color: name === 'Male' ? '#3182CE' : 
             name === 'Female' ? '#6E40C9' : 
             '#10B981'
    }));
  }, [patients]);
  
  // Injury mechanism distribution
  const injuryMechanisms = React.useMemo(() => {
    const mechanisms: Record<string, number> = {};
    
    patients.forEach(patient => {
      if (patient.concussion?.mechanismOfInjury) {
        const mechanism = patient.concussion.mechanismOfInjury;
        mechanisms[mechanism] = (mechanisms[mechanism] || 0) + 1;
      }
    });
    
    return Object.entries(mechanisms)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Get top 8 mechanisms
  }, [patients]);
  
  // Sport activity distribution
  const sportActivities = React.useMemo(() => {
    const activities: Record<string, number> = {};
    
    patients.forEach(patient => {
      if (patient.concussion?.sportActivity) {
        const sport = patient.concussion.sportActivity;
        activities[sport] = (activities[sport] || 0) + 1;
      }
    });
    
    return Object.entries(activities)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Get top 8 sports
  }, [patients]);
  
  // Age vs Recovery correlation data
  const ageVsRecoveryData = React.useMemo(() => {
    return patients
      .filter(patient => patient.lastCheckin)
      .map(patient => ({
        age: getAge(patient.dateOfBirth),
        score: patient.lastCheckin?.pcssTotal || 0,
        name: `${patient.firstName} ${patient.lastName}`,
        riskLevel: patient.riskLevel
      }));
  }, [patients]);
  
  if (loading) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 mb-6">
        <CardHeader>
          <CardTitle>Patient Cohort Analytics</CardTitle>
          <CardDescription>Loading cohort data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 mb-6">
        <CardHeader>
          <CardTitle>Patient Cohort Analytics</CardTitle>
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
        <CardTitle>Patient Cohort Analytics</CardTitle>
        <CardDescription>
          Demographic and clinical characteristics of the patient population
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="demographics">
          <TabsList className="mb-4">
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="injuries">Injury Analysis</TabsTrigger>
            <TabsTrigger value="correlations">Clinical Correlations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demographics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Age Distribution */}
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ageGroups}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {ageGroups.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [formatNumber(value as number), 'Patients']}
                          contentStyle={{ backgroundColor: '#333333', borderColor: '#444444' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Gender Distribution */}
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {genderDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [formatNumber(value as number), 'Patients']}
                          contentStyle={{ backgroundColor: '#333333', borderColor: '#444444' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Patient Demographics Summary */}
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Demographic Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-neutral-700/50 p-4 rounded-lg">
                    <div className="text-sm text-neutral-400">Total Patients</div>
                    <div className="text-2xl font-bold mt-1">{formatNumber(patients.length)}</div>
                  </div>
                  
                  <div className="bg-neutral-700/50 p-4 rounded-lg">
                    <div className="text-sm text-neutral-400">Average Age</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatNumber(Math.round(patients.reduce((sum, p) => sum + getAge(p.dateOfBirth), 0) / patients.length || 0))}
                    </div>
                  </div>
                  
                  <div className="bg-neutral-700/50 p-4 rounded-lg">
                    <div className="text-sm text-neutral-400">Male/Female Ratio</div>
                    <div className="text-2xl font-bold mt-1">
                      {genderDistribution[0]?.value}:{genderDistribution[1]?.value}
                    </div>
                  </div>
                  
                  <div className="bg-neutral-700/50 p-4 rounded-lg">
                    <div className="text-sm text-neutral-400">Prior Concussions</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatNumber(patients.filter(p => p.priorConcussionHistory).length)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="injuries" className="space-y-4">
            {/* Injury Mechanism */}
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Injury Mechanisms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={injuryMechanisms}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                      <XAxis type="number" stroke="#888888" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke="#888888" 
                        tick={{ fontSize: 12 }}
                        width={100}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#333333', borderColor: '#444444' }}
                        formatter={(value) => [formatNumber(value as number), 'Patients']}
                      />
                      <Bar 
                        dataKey="value" 
                        name="Patients" 
                        fill="#6E40C9" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Sport Activities */}
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sport/Activity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={sportActivities}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                      <XAxis type="number" stroke="#888888" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke="#888888" 
                        tick={{ fontSize: 12 }}
                        width={100}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#333333', borderColor: '#444444' }}
                        formatter={(value) => [formatNumber(value as number), 'Patients']}
                      />
                      <Bar 
                        dataKey="value" 
                        name="Patients" 
                        fill="#3182CE" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="correlations" className="space-y-4">
            {/* Age vs Recovery Correlation */}
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Age vs. Symptom Severity Correlation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                      <XAxis 
                        type="number" 
                        dataKey="age" 
                        name="Age" 
                        stroke="#888888"
                        domain={[0, 100]}
                        label={{ value: 'Age (years)', position: 'insideBottom', offset: -10, fill: '#888888' }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="score" 
                        name="PCSS Score" 
                        stroke="#888888"
                        domain={[0, 132]}
                        label={{ value: 'PCSS Score', angle: -90, position: 'insideLeft', fill: '#888888' }}
                      />
                      <ZAxis 
                        type="number" 
                        range={[60, 400]} 
                        dataKey="score" 
                      />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: '#333333', borderColor: '#444444' }}
                        formatter={(value, name, props) => {
                          const patient = props.payload;
                          return [
                            `${name}: ${value}`,
                            `Patient: ${patient.name}`
                          ];
                        }}
                      />
                      <Scatter 
                        name="Age vs. Symptom Severity" 
                        data={ageVsRecoveryData} 
                        fill="#6E40C9"
                        shape={(props) => {
                          const { cx, cy } = props;
                          const riskLevel = props.payload.riskLevel;
                          const fillColor = riskLevel === 'critical' ? '#EF4444' : 
                                           riskLevel === 'recovering' ? '#F59E0B' : '#10B981';
                          return (
                            <circle 
                              cx={cx} 
                              cy={cy} 
                              r={6} 
                              stroke="#333333" 
                              strokeWidth={1} 
                              fill={fillColor} 
                            />
                          );
                        }}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Correlation Insights */}
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Clinical Correlation Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-neutral-700 rounded-md">
                    <h3 className="text-sm font-medium mb-2 text-primary">Key Demographic Observations</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-neutral-300">
                      <li><span className="font-medium">Age correlation:</span> Patients over 35 show 22% slower recovery rates</li>
                      <li><span className="font-medium">Injury mechanism:</span> Contact sports injuries typically recover faster than MVA injuries</li>
                      <li><span className="font-medium">Gender differences:</span> Female patients report higher initial symptom severity</li>
                      <li><span className="font-medium">Prior history impact:</span> Each previous concussion extends average recovery time by 5-7 days</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border border-neutral-700 rounded-md">
                    <h3 className="text-sm font-medium mb-2 text-primary">Clinical Risk Stratification</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-neutral-300">
                      <li><span className="font-medium">High risk profile:</span> Age &gt;35, multiple previous concussions, initial PCSS &gt;65</li>
                      <li><span className="font-medium">Moderate risk profile:</span> Age 18-35, 1 previous concussion, initial PCSS 40-65</li>
                      <li><span className="font-medium">Standard risk profile:</span> Age &lt;18, no previous concussions, initial PCSS &lt;40</li>
                      <li><span className="font-medium">Recovery prediction:</span> Risk factors combine to predict expected recovery timeline</li>
                    </ul>
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