import React, { useState } from 'react';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';

interface SymptomRadarChartProps {
    radarData: Array<{ subject: string; A: number }>;
}

const SymptomRadarChart: React.FC<SymptomRadarChartProps> = ({ radarData }) => {
    const subjects = radarData.map((d) => d.subject);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
        () => subjects.slice(0, 6)
    );
    const filteredData = radarData.filter((d) =>
        selectedSubjects.includes(d.subject)
    );

    const toggleSubject = (subject: string, checked: boolean) => {
        if (checked) {
            setSelectedSubjects([...selectedSubjects, subject]);
        } else {
            setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
        }
    };

    return (
        <Card className="bg-neutral-800 border-neutral-700 flex items-start">
            {/* Chart area */}
            <div className="flex-1">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Symptom Severity Pattern</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius={130} data={filteredData}>
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
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#333333',
                                        borderColor: '#444444',
                                    }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </div>
            {/* Selector sidebar */}
            <div className="p-4 border-l border-neutral-700 max-h-[95vh] overflow-y-auto">
                {subjects.map((subject) => (
                    <label
                        key={subject}
                        className="flex items-center space-x-2 py-1"
                    >
                        <Checkbox
                            checked={selectedSubjects.includes(subject)}
                            onCheckedChange={(checked) =>
                                toggleSubject(subject, Boolean(checked))
                            }
                        />
                        <span className="text-sm text-neutral-200">{subject}</span>
                    </label>
                ))}
            </div>
        </Card>
    );
};

export default SymptomRadarChart;
