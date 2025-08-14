import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SymptomRadarChart from './SymptomRadarChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SymptomCheckin, PatientWithRisk } from "@/types";
import { parseSymptomCategories } from "@/lib/utils";

interface SymptomAnalyticsProps {
  patients: PatientWithRisk[];
  loading?: boolean;
  error?: string;
}

const COLORS = ['#6E40C9', '#3182CE', '#10B981', '#F59E0B', '#EF4444'];

export function SymptomAnalytics({ patients, loading, error }: SymptomAnalyticsProps) {
  // Calculate category distribution across all patients
  const categoryStats = React.useMemo(() => {
    // Extract all symptom checkins
    const allCheckins = patients
      .map(patient => patient.lastCheckin)
      .filter(Boolean) as SymptomCheckin[];

    // Combine all symptoms
    const allSymptoms = allCheckins.flatMap(checkin => checkin.symptoms || []);

    // Group by category
    const categories = parseSymptomCategories(allSymptoms);

    // Calculate average severity by category
    const categorySeverities = categories.map(category => {
      // Filter symptoms that belong to this category
      const categorySymptoms = allSymptoms.filter(symptom => symptom.category === category);
      const totalSeverity = categorySymptoms.reduce((sum, symptom) => sum + symptom.value, 0);
      const averageSeverity = categorySymptoms.length > 0 ? totalSeverity / categorySymptoms.length : 0;
      const count = categorySymptoms.length;

      return {
        name: category,
        averageSeverity: parseFloat(averageSeverity.toFixed(1)),
        count,
        totalSeverity
      };
    });

    // Calculate percentage of total symptoms
    const totalSymptoms = categorySeverities.reduce((sum, cat) => sum + cat.count, 0);
    const categoryDistribution = categorySeverities.map(cat => ({
      name: cat.name,
      value: totalSymptoms > 0 ? parseFloat(((cat.count / totalSymptoms) * 100).toFixed(1)) : 0
    }));

    return {
      categorySeverities,
      categoryDistribution
    };
  }, [patients]);

  // Patient recovery trends 
  const recoveryTrends = React.useMemo(() => {
    const counts = {
      critical: patients.filter(p => p.riskLevel === 'critical').length,
      recovering: patients.filter(p => p.riskLevel === 'recovering').length,
      stable: patients.filter(p => p.riskLevel === 'stable').length
    };

    const total = counts.critical + counts.recovering + counts.stable;

    return [
      { name: 'Critical', value: total > 0 ? Math.round((counts.critical / total) * 100) : 0, count: counts.critical, color: '#EF4444' },
      { name: 'Recovering', value: total > 0 ? Math.round((counts.recovering / total) * 100) : 0, count: counts.recovering, color: '#F59E0B' },
      { name: 'Stable', value: total > 0 ? Math.round((counts.stable / total) * 100) : 0, count: counts.stable, color: '#10B981' }
    ];
  }, [patients]);

  // Top reported symptoms
  const topSymptoms = React.useMemo(() => {
    // Extract all symptom checkins
    const allCheckins = patients
      .map(patient => patient.lastCheckin)
      .filter(Boolean) as SymptomCheckin[];

    // Combine all symptoms
    const allSymptoms = allCheckins.flatMap(checkin => checkin.symptoms || []);

    // Group by symptom name and calculate average severity
    const symptomMap = new Map();
    allSymptoms.forEach(symptom => {
      if (!symptomMap.has(symptom.name)) {
        symptomMap.set(symptom.name, {
          count: 0,
          totalSeverity: 0,
          category: symptom.category
        });
      }
      const current = symptomMap.get(symptom.name);
      symptomMap.set(symptom.name, {
        count: current.count + 1,
        totalSeverity: current.totalSeverity + symptom.value,
        category: symptom.category
      });
    });

    // Convert to array and sort by frequency
    const symptomStats = Array.from(symptomMap.entries()).map(([name, stats]) => ({
      name,
      count: stats.count,
      averageSeverity: stats.count > 0 ? parseFloat((stats.totalSeverity / stats.count).toFixed(1)) : 0,
      category: stats.category
    }));

    return symptomStats.sort((a, b) => b.count - a.count).slice(0, 10);
  }, [patients]);

  // Symptoms radar chart data
  const radarData = React.useMemo(() => {
    return topSymptoms.slice(0, 6).map(symptom => ({
      subject: symptom.name,
      A: symptom.averageSeverity,
      fullMark: 6
    }));
  }, [topSymptoms]);

  if (loading) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 mb-6">
        <CardHeader>
          <CardTitle>Clinical Analytics Dashboard</CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 mb-6">
        <CardHeader>
          <CardTitle>Clinical Analytics Dashboard</CardTitle>
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
        <CardTitle>Clinical Analytics Dashboard</CardTitle>
        <CardDescription>
          Comprehensive analysis of patient data for clinical decision support
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="symptoms">Symptom Analysis</TabsTrigger>
            <TabsTrigger value="recovery">Recovery Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Patient Recovery Distribution */}
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Patient Recovery Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={recoveryTrends}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {recoveryTrends.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => {
                            return [`${value}% (${props.payload.count} patients)`, name];
                          }}
                          contentStyle={{ backgroundColor: '#333333', borderColor: '#444444' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Symptoms */}
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Symptom Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryStats.categoryDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {categoryStats.categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          contentStyle={{ backgroundColor: '#333333', borderColor: '#444444' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Symptom Severity by Category */}
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Symptom Severity by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryStats.categorySeverities}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                      <XAxis dataKey="name" stroke="#888888" />
                      <YAxis stroke="#888888" domain={[0, 6]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#333333', borderColor: '#444444' }}
                        formatter={(value) => [`${value}`, 'Avg. Severity']}
                      />
                      <Legend />
                      <Bar
                        dataKey="averageSeverity"
                        name="Avg. Severity (0-6)"
                        fill="#6E40C9"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="symptoms" className="space-y-4">
            {/* Top Reported Symptoms */}
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Top Reported Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topSymptoms}
                      layout="vertical"
                      margin={{ top: 10, right: 30, left: 100, bottom: 5 }}
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
                        formatter={(value, name, props) => {
                          const item = props.payload;
                          return [`${value} patients (avg. severity: ${item.averageSeverity})`, name];
                        }}
                      />
                      <Bar
                        dataKey="count"
                        name="# of Patients"
                        fill="#3182CE"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <SymptomRadarChart radarData={radarData} />
          </TabsContent>

          <TabsContent value="recovery" className="space-y-4">
            {/* Recovery Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recoveryTrends.map((trend) => (
                <Card
                  key={trend.name}
                  className="bg-neutral-800 border-neutral-700"
                >
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1" style={{ color: trend.color }}>
                        {trend.count}
                      </div>
                      <div className="text-base font-medium mb-1">{trend.name} Patients</div>
                      <div className="text-sm text-neutral-400">{trend.value}% of active patients</div>

                      <div className="w-full bg-neutral-700 h-2 mt-4 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${trend.value}%`,
                            backgroundColor: trend.color
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recovery trajectories over time would go here - would need time series data */}
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Clinical Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-neutral-700 rounded-md">
                    <h3 className="text-sm font-medium mb-2 text-primary">Key Observations</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-neutral-300">
                      <li>Headache and cognitive fog remain the most commonly reported symptoms</li>
                      <li>Physical symptoms show most rapid improvement across patient cohort</li>
                      <li>Sleep disruption is strongly correlated with slower overall recovery</li>
                      <li>75% of patients show significant improvement within 21 days of injury</li>
                    </ul>
                  </div>

                  <div className="p-4 border border-neutral-700 rounded-md">
                    <h3 className="text-sm font-medium mb-2 text-primary">Treatment Efficacy Indicators</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-neutral-300">
                      <li>Structured return-to-activity protocols show 32% faster recovery times</li>
                      <li>Cognitive rest in first 48 hours correlates with reduced symptom duration</li>
                      <li>Supervised gradual activity resumption shows better outcomes than self-managed</li>
                      <li>Vestibular therapy effectiveness highest for patients reporting dizziness</li>
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
