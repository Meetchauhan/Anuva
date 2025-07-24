import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import type { cn, getSymptomData } from "../../lib/utils";
import type { SymptomCheckin } from "../../types";

interface SymptomTrajectoryProps {
  checkins: SymptomCheckin[];
  days?: 7 | 14 | 30 | 'all';
  height?: number;
  className?: string;
}

export function SymptomTrajectory({ checkins = [], days = 14, height = 180, className }: SymptomTrajectoryProps) {
  // Filter data based on selected time range
  const filteredCheckins = React.useMemo(() => {
    if (days === 'all' || !checkins.length) return checkins;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return checkins.filter(checkin => 
      new Date(checkin.checkInDate) >= cutoffDate
    );
  }, [checkins, days]);
  
  // Format data for the chart
  const { labels, data } = getSymptomData(filteredCheckins);
  
  const chartData = labels.map((label, index) => ({
    name: label,
    score: data[index]
  }));
  
  const [activeButton, setActiveButton] = React.useState<7 | 14 | 30 | 'all'>(days);
  
  const handleTimeRangeChange = (newRange: 7 | 14 | 30 | 'all') => {
    setActiveButton(newRange);
  };
  
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-sm text-neutral-400">PCSS Total Score</span>
          <div className="flex items-baseline">
            <span className={cn(
              "text-2xl font-bold",
              data.length > 0 ? (
                data[data.length - 1] > 60 ? "text-status-red" : 
                data[data.length - 1] > 30 ? "text-status-yellow" : 
                "text-status-green"
              ) : "text-neutral-400"
            )}>
              {data.length > 0 ? data[data.length - 1] : "-"}
            </span>
            {data.length > 1 && (
              <span className={cn(
                "ml-2 text-sm",
                data[data.length - 1] > data[data.length - 2] ? "text-status-red" :
                data[data.length - 1] < data[data.length - 2] ? "text-status-green" :
                "text-neutral-400"
              )}>
                {data[data.length - 1] > data[data.length - 2] ? 
                  `+${data[data.length - 1] - data[data.length - 2]} from last check-in` : 
                  data[data.length - 1] < data[data.length - 2] ?
                  `-${data[data.length - 2] - data[data.length - 1]} from last check-in` :
                  "No change from last check-in"}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            className={cn(
              "px-2 py-1 text-xs rounded-md",
              activeButton === 7 ? "bg-primary" : "bg-neutral-700"
            )} 
            onClick={() => handleTimeRangeChange(7)}
          >
            7 Days
          </button>
          <button 
            className={cn(
              "px-2 py-1 text-xs rounded-md",
              activeButton === 14 ? "bg-primary" : "bg-neutral-700"
            )} 
            onClick={() => handleTimeRangeChange(14)}
          >
            14 Days
          </button>
          <button 
            className={cn(
              "px-2 py-1 text-xs rounded-md",
              activeButton === 30 ? "bg-primary" : "bg-neutral-700"
            )} 
            onClick={() => handleTimeRangeChange(30)}
          >
            30 Days
          </button>
          <button 
            className={cn(
              "px-2 py-1 text-xs rounded-md",
              activeButton === 'all' ? "bg-primary" : "bg-neutral-700"
            )} 
            onClick={() => handleTimeRangeChange('all')}
          >
            All
          </button>
        </div>
      </div>
      
      <div className="h-[180px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                stroke="#888888" 
                tick={{ fontSize: 12 }} 
                domain={[0, 132]} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#333333', 
                  border: '1px solid #444444',
                  borderRadius: '4px'
                }}
                itemStyle={{ color: '#FFFFFF' }}
                labelStyle={{ color: '#AAAAAA' }}
              />
              <ReferenceLine y={60} stroke="#D64242" strokeDasharray="3 3" />
              <ReferenceLine y={30} stroke="#E8C547" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#2A6BAE" 
                strokeWidth={2} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-500">
            No symptom data available
          </div>
        )}
      </div>
    </div>
  );
}
