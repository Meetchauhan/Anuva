import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface SymptomRadarChartProps {
    radarData: Array<{ subject: string; A: number }>;
}

const SymptomRadarChart: React.FC<SymptomRadarChartProps> = ({ radarData }) => {
    return (
        <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Symptom Severity Pattern</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius={130} data={radarData}>
                            <PolarGrid stroke="#444444" />
                            <PolarAngleAxis dataKey="subject" stroke="#888888" />
                            <PolarRadiusAxis angle={30} domain={[0, 6]} stroke="#888888" />
                            <Radar
                                name="Average Severity"
                                dataKey="A"
                                stroke="#6E40C9"
                                fill="#6E40C9"
                                fillOpacity={0.5}
                            />
                            <Tooltip contentStyle={{ backgroundColor: '#333333', borderColor: '#444444' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default SymptomRadarChart;
