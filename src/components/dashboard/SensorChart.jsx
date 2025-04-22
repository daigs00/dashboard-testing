import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchSensorData, processSensorData } from '../../services/sensorDataService';

const SensorChart = ({ sensorId, sensorType, timeRange, unit }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Use a ref to store the interval ID for cleanup
  const pollingInterval = useRef(null);
  
  useEffect(() => {
    // Function to fetch data from the server
    const fetchSensorDataFromServer = async () => {
      try {
        setLoading(true);
        
        // Fetch raw data from the server
        const rawData = await fetchSensorData(sensorType);
        
        // Process data based on sensor type
        const processedData = processSensorData(rawData, sensorType, timeRange);
        
        setData(processedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching sensor data:', err);
        setError('Failed to load sensor data');
      } finally {
        setLoading(false);
      }
    };
    
    // Initial data fetch
    fetchSensorDataFromServer();
    
    // Set up polling interval (every 5 seconds)
    pollingInterval.current = setInterval(fetchSensorDataFromServer, 5000);
    
    // Clean up interval on unmount or when dependencies change
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [sensorId, sensorType, timeRange]);
  
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
  
  if (loading && data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error && data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-danger-400 text-sm">
        <span>{error}</span>
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
