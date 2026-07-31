import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { LogEntry } from '../types/logEntry';

interface PointsChartProps {
  logEntries: LogEntry[];
  height?: number;
}

// interface DataPoint {
//   date: string;
//   pb: number;
//   jam: number;
// }

export default function PointsChart({ logEntries, height = 300 }: PointsChartProps) {
  const data = useMemo(() => {
    const entriesByDate: Record<string, { pb: number; jam: number }> = {};
        const sortedEntries = [...logEntries].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    let pbTotal = 0;
    let jamTotal = 0;
    
    sortedEntries.forEach((entry) => {
      const date = new Date(entry.timestamp);
      const dateKey = date.toLocaleDateString(); // e.g., "1/15/2025"
      
      if (!entriesByDate[dateKey]) {
        entriesByDate[dateKey] = { pb: pbTotal, jam: jamTotal };
      }
      
      if (entry.user === 'pb') {
        pbTotal += entry.pointsEarned;
      } else {
        jamTotal += entry.pointsEarned;
      }
      entriesByDate[dateKey] = { pb: pbTotal, jam: jamTotal };
    });
    
    return Object.entries(entriesByDate).map(([date, points]) => ({
      date,
      pb: points.pb,
      jam: points.jam,
    }));
  }, [logEntries]);

  if (data.length === 0) {
    return (
      <div className="chart-empty" style={{ height: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#999' }}>No data yet. Start logging to see your progress!</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis 
          domain={['dataMin', 'dataMax']}
          allowDataOverflow={true}
          tick={{ fontSize: 12 }}
          label={{ value: 'Points', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
        />
        <Tooltip 
          formatter={(value: any, name: any) => {
            const label = name === 'pb' ? 'PB' : 'J';
            return [`${value} pts`, label];
          }}
          labelFormatter={(label)=> `${label}`}
        />
        <Line
          type="monotone"
          dataKey="pb"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="jam"
          stroke="#ec4899"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}