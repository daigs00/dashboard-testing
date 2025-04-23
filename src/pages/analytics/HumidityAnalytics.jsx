import React, { useState, useEffect, useRef } from 'react';
import { Droplet, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Area, ComposedChart } from 'recharts';
import { format } from 'date-fns';
import AnalyticsLayout from '../../components/layout/AnalyticsLayout';
import { fetchSensorData, processSensorData } from '../../services/sensorDataService';

const HumidityAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('day');
  const [stats, setStats] = useState({
    current: 0,
    min: 0,
    max: 0,
    avg: 0,
    unit: '%'
  });
  
  // Use a ref to store the interval ID for cleanup
  const pollingInterval = useRef(null);
  
  // Fetch humidity data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch raw data from the server
        const rawData = await fetchSensorData('humidity');
        
        // Process data based on selected time range
        const processedData = processSensorData(rawData, 'humidity', timeRange);
        setData(processedData);
        
        // Calculate stats
        if (processedData.length > 0) {
          const values = processedData.map(item => item.value);
          const current = values[values.length - 1];
          const min = Math.min(...values);
          const max = Math.max(...values);
          const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
          
          setStats({
            current: current.toFixed(1),
            min: min.toFixed(1),
            max: max.toFixed(1),
            avg: avg.toFixed(1),
            unit: '%'
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching humidity data:', err);
        setError('Failed to load humidity data');
      } finally {
        setLoading(false);
      }
    };
    
    // Initial data fetch
    fetchData();
    
    // Set up polling interval (every 30 seconds)
    pollingInterval.current = setInterval(fetchData, 30000);
    
    // Clean up interval on unmount or when dependencies change
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [timeRange]);
  
  // Handle refresh
  const handleRefresh = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }
    
    // Trigger a data refresh
    setLoading(true);
    fetchSensorData('humidity')
      .then(rawData => {
        const processedData = processSensorData(rawData, 'humidity', timeRange);
        setData(processedData);
        
        // Recalculate stats
        if (processedData.length > 0) {
          const values = processedData.map(item => item.value);
          const current = values[values.length - 1];
          const min = Math.min(...values);
          const max = Math.max(...values);
          const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
          
          setStats({
            current: current.toFixed(1),
            min: min.toFixed(1),
            max: max.toFixed(1),
            avg: avg.toFixed(1),
            unit: '%'
          });
        }
        
        setError(null);
      })
      .catch(err => {
        console.error('Error refreshing humidity data:', err);
        setError('Failed to refresh humidity data');
      })
      .finally(() => {
        setLoading(false);
        // Restart polling
        pollingInterval.current = setInterval(() => {
          handleRefresh();
        }, 30000);
      });
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg px-3 py-2 rounded-lg border border-gray-800 shadow-lg text-white">
          <p className="text-xs text-gray-400">{`Time: ${label}`}</p>
          <p className="text-sm font-medium text-white">{`Humidity: ${payload[0].value.toFixed(1)}${stats.unit}`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Calculate humidity thresholds
  const lowHumidity = 30.0; // Low humidity threshold
  const optimalLow = 40.0; // Optimal low range
  const optimalHigh = 60.0; // Optimal high range
  const highHumidity = 70.0; // High humidity threshold
  
  return (
    <AnalyticsLayout
      title="Humidity Analytics"
      description="Detailed humidity monitoring and analysis"
      icon={Droplet}
      isLoading={loading}
      onRefresh={handleRefresh}
    >
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Current Humidity</h3>
          <div className="mt-2 flex items-center">
            <span className="text-2xl font-bold text-white">{stats.current}{stats.unit}</span>
            <Droplet className="ml-2 h-5 w-5 text-primary-400" />
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Minimum</h3>
          <div className="mt-2 flex items-center">
            <span className="text-2xl font-bold text-white">{stats.min}{stats.unit}</span>
            <ArrowDown className="ml-2 h-5 w-5 text-warning-400" />
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Maximum</h3>
          <div className="mt-2 flex items-center">
            <span className="text-2xl font-bold text-white">{stats.max}{stats.unit}</span>
            <ArrowUp className="ml-2 h-5 w-5 text-warning-400" />
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Average</h3>
          <div className="mt-2 flex items-center">
            <span className="text-2xl font-bold text-white">{stats.avg}{stats.unit}</span>
          </div>
        </div>
      </div>
      
      {/* Time range selector */}
      <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-white">Humidity Trends</h2>
          
          <div className="flex space-x-2">
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  timeRange === range 
                    ? 'bg-primary-800 bg-opacity-70 text-primary-300 border border-primary-700' 
                    : 'bg-gray-800 bg-opacity-50 text-gray-400 hover:bg-gray-700 hover:bg-opacity-50 border border-gray-700'
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Main chart */}
        <div className="h-80 w-full">
          {loading && data.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : error && data.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-danger-400">
              <AlertCircle className="h-8 w-8 mb-2" />
              <span>{error}</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="formattedTime" 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  tickLine={{ stroke: '#4B5563' }}
                  axisLine={{ stroke: '#4B5563' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  tickLine={{ stroke: '#4B5563' }}
                  axisLine={{ stroke: '#4B5563' }}
                  domain={[0, 100]}
                  unit={stats.unit}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {/* Optimal humidity range area */}
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  fill="#3B82F6" 
                  fillOpacity={0.1} 
                  stroke="none"
                  activeDot={false}
                  name="Humidity Range"
                />
                
                {/* Reference lines for thresholds */}
                <ReferenceLine 
                  y={lowHumidity} 
                  label={{ value: 'Too Dry', position: 'right', fill: '#F59E0B' }} 
                  stroke="#F59E0B" 
                  strokeDasharray="3 3" 
                />
                <ReferenceLine 
                  y={optimalLow} 
                  label={{ value: 'Optimal Low', position: 'right', fill: '#10B981' }} 
                  stroke="#10B981" 
                  strokeDasharray="3 3" 
                />
                <ReferenceLine 
                  y={optimalHigh} 
                  label={{ value: 'Optimal High', position: 'right', fill: '#10B981' }} 
                  stroke="#10B981" 
                  strokeDasharray="3 3" 
                />
                <ReferenceLine 
                  y={highHumidity} 
                  label={{ value: 'Too Humid', position: 'right', fill: '#F59E0B' }} 
                  stroke="#F59E0B" 
                  strokeDasharray="3 3" 
                />
                
                {/* Humidity line */}
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Humidity"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#3B82F6', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#3B82F6', stroke: '#fff', strokeWidth: 1 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {/* Last updated */}
        <div className="mt-2 text-xs text-gray-400 text-right">
          Last updated: {data.length > 0 ? format(new Date(data[data.length - 1].time), 'MMM d, yyyy h:mm:ss a') : '-'}
        </div>
      </div>
      
      {/* Humidity information */}
      <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
        <h2 className="text-lg font-medium text-white mb-3">Humidity Guidelines</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-primary-300 mb-2">Optimal Range</h3>
            <p className="text-sm text-gray-300">
              The ideal humidity level for server rooms is between 40% and 60%. This range helps prevent static electricity while avoiding condensation issues.
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-warning-300 mb-2">Low Humidity Risks</h3>
            <p className="text-sm text-gray-300">
              Humidity below 30% increases the risk of electrostatic discharge (ESD), which can damage sensitive electronic components.
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-warning-300 mb-2">High Humidity Risks</h3>
            <p className="text-sm text-gray-300">
              Humidity above 70% can lead to condensation, which increases the risk of short circuits, corrosion, and equipment failure.
            </p>
          </div>
        </div>
      </div>
    </AnalyticsLayout>
  );
};

export default HumidityAnalytics;
