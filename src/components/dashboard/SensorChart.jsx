import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, subMonths, subYears, parseISO } from 'date-fns';

const SensorChart = ({ sensorId, sensorType, timeRange, unit }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // In a real app, fetch data from API based on sensorId and timeRange
        // For now, generate some fake data based on the time range
        
        const now = new Date();
        let dataPoints = [];
        let dateFormat = '';
        
        // Generate mock data based on the time range
        switch(timeRange) {
          case 'day':
            // 24 data points for a day (hourly)
            dataPoints = Array.from({ length: 24 }, (_, i) => {
              const time = new Date(now);
              time.setHours(now.getHours() - (23 - i));
              
              return {
                time: time.toISOString(),
                value: generateValue(sensorType, i)
              };
            });
            dateFormat = 'HH:mm';
            break;
            
          case 'week':
            // 7 data points for a week (daily)
            dataPoints = Array.from({ length: 7 }, (_, i) => {
              const date = subDays(now, 6 - i);
              
              return {
                time: date.toISOString(),
                value: generateValue(sensorType, i)
              };
            });
            dateFormat = 'EEE';
            break;
            
          case 'month':
            // 30 data points for a month (daily)
            dataPoints = Array.from({ length: 30 }, (_, i) => {
              const date = subDays(now, 29 - i);
              
              return {
                time: date.toISOString(),
                value: generateValue(sensorType, i)
              };
            });
            dateFormat = 'dd MMM';
            break;
            
          case 'year':
            // 12 data points for a year (monthly)
            dataPoints = Array.from({ length: 12 }, (_, i) => {
              const date = subMonths(now, 11 - i);
              
              return {
                time: date.toISOString(),
                value: generateValue(sensorType, i)
              };
            });
            dateFormat = 'MMM';
            break;
            
          default:
            dateFormat = 'HH:mm';
            break;
        }
        
        // Format the data for the chart
        const formattedData = dataPoints.map(point => ({
          time: point.time,
          formattedTime: format(parseISO(point.time), dateFormat),
          value: point.value
        }));
        
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [sensorId, sensorType, timeRange]);
  
  // Helper function to generate realistic-looking sensor values
  const generateValue = (type, index) => {
    // Base value and variation by sensor type
    const baseValues = {
      temperature: 22,
      humidity: 45,
      smoke: 3.5
    };
    
    const variations = {
      temperature: 5,
      humidity: 15,
      smoke: 1.5
    };
    
    // Generate a value with some randomness and a trend
    const baseValue = baseValues[type] || 50;
    const variation = variations[type] || 10;
    
    // Add some noise and a slight upward trend
    const noise = (Math.random() - 0.5) * variation;
    const trend = (index / 20) * variation;
    
    return +(baseValue + noise + trend).toFixed(1);
  };
  
  // Get chart color based on sensor type
  const getChartGradient = () => {
    switch(sensorType) {
      case 'temperature': return ['#f97316', '#ef4444'];  // orange to red
      case 'humidity': return ['#0ea5e9', '#3b82f6'];    // light blue to blue
      case 'smoke': return ['#a1a1aa', '#71717a'];       // gray to darker gray
      default: return ['#8b5cf6', '#6366f1'];            // purple to indigo
    }
  };
  
  const gradientColors = getChartGradient();
  
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg px-3 py-2 rounded-lg border border-gray-800 shadow-lg text-white">
          <p className="text-xs text-gray-400">{`Time: ${label}`}</p>
          <p className="text-sm font-medium text-white">{`Value: ${payload[0].value} ${unit}`}</p>
        </div>
      );
    }
  
    return null;
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id={`chart-gradient-${sensorId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.3} />
        <XAxis 
          dataKey="formattedTime" 
          tick={{ fontSize: 12, fill: '#9CA3AF' }}
          tickLine={{ stroke: '#4B5563' }}
          axisLine={{ stroke: '#4B5563' }}
          tickMargin={8}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#9CA3AF' }}
          tickLine={{ stroke: '#4B5563' }}
          axisLine={{ stroke: '#4B5563' }}
          width={25}
          tickMargin={8}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={`url(#chart-gradient-${sensorId})`}
          strokeWidth={2}
          dot={{ r: 2, fill: gradientColors[1], strokeWidth: 0 }}
          activeDot={{ r: 5, fill: gradientColors[0], stroke: '#fff', strokeWidth: 1 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SensorChart;
