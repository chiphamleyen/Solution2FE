import React from 'react';
import { Card } from 'react-bootstrap';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { COLORS } from './ChartColors';

const TrendLineChart = ({ data }) => {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h5 className="card-title mb-4" style={{ color: "#475569" }}>Detection Trends</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              tick={{ fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px'
              }}
            />
            <Legend 
              wrapperStyle={{
                paddingTop: "10px"
              }}
            />
            {Object.keys(data[0] || {})
              .filter(key => key !== 'date')
              .map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS.chart[index % COLORS.chart.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default TrendLineChart; 