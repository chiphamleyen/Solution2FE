import React, { useState, useEffect } from 'react';
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
import { format, subDays } from 'date-fns';
import axiosUser from '../../../api/axiosUser';
import { API_PATHS_USER } from '../../../api/config';

const TrendLineChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        // Create array of dates for last 7 days
        const dateRanges = Array.from({ length: 7 }, (_, i) => {
          const targetDate = subDays(new Date(), i);
          const yesterday = format(subDays(targetDate, 1), 'yyyy-MM-dd');
          const today = format(targetDate, 'yyyy-MM-dd');
          return {
            date: format(targetDate, 'MMM dd'),
            dateRange: { yesterday, today }
          };
        }).reverse(); // Reverse to get chronological order

        // Create array of promises for all API calls
        const apiPromises = dateRanges.map(({ dateRange }) => 
          axiosUser.get(
            `${API_PATHS_USER.REPORT.split('?')[0]}?min_date=${dateRange.yesterday}&max_date=${dateRange.today}`
          )
        );

        // Execute all API calls in parallel
        const responses = await Promise.all(apiPromises);

        // Process all responses
        const processedData = responses.map((response, index) => {
          const dayData = response.data.data;
          
          // Create an object with the date
          const dataPoint = {
            date: dateRanges[index].date,
          };

          // Add counts for each malware type
          dayData.classifier.forEach(item => {
            if (item.type !== "Benign") {
              dataPoint[item.type] = item.total;
            }
          });

          return dataPoint;
        });

        setChartData(processedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching trend data:", error);
        setError("Failed to load trend data");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, []);

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
          <div className="text-danger">{error}</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h5 className="card-title mb-4" style={{ color: "#475569" }}>Weekly Detection Trends</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
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
            {Object.keys(chartData[0] || {})
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