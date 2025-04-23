import React, { useState, useEffect, useRef } from 'react';
import { Wind, AlertCircle, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import AnalyticsLayout from '../../components/layout/AnalyticsLayout';
import { fetchSensorData, processSensorData } from '../../services/sensorDataService';

const AirQualityAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('day');
  const [chartType, setChartType] = useState('line'); // 'line', 'area', 'bar'
  const [stats, setStats] = useState({
    current: 0,
    min: 0,
    max: 0,
    avg: 0,
    unit: 'ppm'
  });
  
  // Use a ref to store the interval ID for cleanup
  const pollingInterval = useRef(null);
  
  // Fetch air quality data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch raw data from the server
        const rawData = await fetchSensorData('smoke');
        
        // Process data based on selected time range
        const processedData = processSensorData(rawData, 'smoke', timeRange);
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
            unit: 'ppm'
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching air quality data:', err);
        setError('Failed to load air quality data');
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
    fetchSensorData('smoke')
      .then(rawData => {
        const processedData = processSensorData(rawData, 'smoke', timeRange);
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
            unit: 'ppm'
          });
        }
        
        setError(null);
      })
      .catch(err => {
        console.error('Error refreshing air quality data:', err);
        setError('Failed to refresh air quality data');
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
          <p className="text-sm font-medium text-white">{`Smoke Level: ${payload[0].value.toFixed(1)} ${stats.unit}`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Return air quality status based on PPM value
  const getAirQualityStatus = (ppm) => {
    if (ppm < 400) return { status: 'Good', color: 'text-success-400', bgColor: 'bg-success-900 bg-opacity-30 border-success-700' };
    if (ppm < 1000) return { status: 'Moderate', color: 'text-primary-400', bgColor: 'bg-primary-900 bg-opacity-30 border-primary-700' };
    if (ppm < 1500) return { status: 'Poor', color: 'text-warning-400', bgColor: 'bg-warning-900 bg-opacity-30 border-warning-700' };
    return { status: 'Hazardous', color: 'text-danger-400', bgColor: 'bg-danger-900 bg-opacity-30 border-danger-700' };
  };
  
  // Get current air quality status
  const currentAirQuality = getAirQualityStatus(parseFloat(stats.current));
  
  // Define smoke thresholds
  const goodAirQuality = 400; // Good air quality threshold
  const moderateAirQuality = 1000; // Moderate air quality threshold
  const poorAirQuality = 1500; // Poor air quality threshold
  
  // Render appropriate chart based on selected chart type
  const renderChart = () => {
    if (loading && data.length === 0) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      );
    }
    
    if (error && data.length === 0) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-danger-400">
          <AlertCircle className="h-8 w-8 mb-2" />
          <span>{error}</span>
        </div>
      );
    }
    
    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
                domain={[0, 'auto']}
                unit={` ${stats.unit}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Reference lines for thresholds */}
              <ReferenceLine 
                y={goodAirQuality} 
                label={{ value: 'Good', position: 'right', fill: '#10B981' }} 
                stroke="#10B981" 
                strokeDasharray="3 3" 
              />
              <ReferenceLine 
                y={moderateAirQuality} 
                label={{ value: 'Moderate', position: 'right', fill: '#0AC2E7' }} 
                stroke="#0AC2E7" 
                strokeDasharray="3 3" 
              />
              <ReferenceLine 
                y={poorAirQuality} 
                label={{ value: 'Poor', position: 'right', fill: '#F59E0B' }} 
                stroke="#F59E0B" 
                strokeDasharray="3 3" 
              />
              
              <Area
                type="monotone"
                dataKey="value"
                name="Smoke Level"
                stroke="#94a3b8"
                fill="#94a3b8"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
                domain={[0, 'auto']}
                unit={` ${stats.unit}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Reference lines for thresholds */}
              <ReferenceLine 
                y={goodAirQuality} 
                label={{ value: 'Good', position: 'right', fill: '#10B981' }} 
                stroke="#10B981" 
                strokeDasharray="3 3" 
              />
              <ReferenceLine 
                y={moderateAirQuality} 
                label={{ value: 'Moderate', position: 'right', fill: '#0AC2E7' }} 
                stroke="#0AC2E7" 
                strokeDasharray="3 3" 
              />
              <ReferenceLine 
                y={poorAirQuality} 
                label={{ value: 'Poor', position: 'right', fill: '#F59E0B' }} 
                stroke="#F59E0B" 
                strokeDasharray="3 3" 
              />
              
              <Bar
                dataKey="value"
                name="Smoke Level"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
                domain={[0, 'auto']}
                unit={` ${stats.unit}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Reference lines for thresholds */}
              <ReferenceLine 
                y={goodAirQuality} 
                label={{ value: 'Good', position: 'right', fill: '#10B981' }} 
                stroke="#10B981" 
                strokeDasharray="3 3" 
              />
              <ReferenceLine 
                y={moderateAirQuality} 
                label={{ value: 'Moderate', position: 'right', fill: '#0AC2E7' }} 
                stroke="#0AC2E7" 
                strokeDasharray="3 3" 
              />
              <ReferenceLine 
                y={poorAirQuality} 
                label={{ value: 'Poor', position: 'right', fill: '#F59E0B' }} 
                stroke="#F59E0B" 
                strokeDasharray="3 3" 
              />
              
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Smoke Level"
                stroke="#94a3b8"
                strokeWidth={2}
                dot={{ r: 2, fill: '#94a3b8', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#94a3b8', stroke: '#fff', strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };
  
  return (
    <AnalyticsLayout
      title="Air Quality Analytics"
      description="Smoke and air quality monitoring and analysis"
      icon={Wind}
      isLoading={loading}
      onRefresh={handleRefresh}
    >
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Current Smoke Level</h3>
          <div className="mt-2 flex items-center">
            <span className="text-2xl font-bold text-white">{stats.current} {stats.unit}</span>
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${currentAirQuality.bgColor}`}>
              {currentAirQuality.status}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Minimum</h3>
          <div className="mt-2 flex items-center">
            <span className="text-2xl font-bold text-white">{stats.min} {stats.unit}</span>
            <ArrowDown className="ml-2 h-5 w-5 text-success-400" />
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Maximum</h3>
          <div className="mt-2 flex items-center">
            <span className="text-2xl font-bold text-white">{stats.max} {stats.unit}</span>
            <ArrowUp className="ml-2 h-5 w-5 text-danger-400" />
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Average</h3>
          <div className="mt-2 flex items-center">
            <span className="text-2xl font-bold text-white">{stats.avg} {stats.unit}</span>
          </div>
        </div>
      </div>
      
      {/* Chart section */}
      <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <h2 className="text-lg font-medium text-white">Air Quality Trends</h2>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            {/* Chart type selector */}
            <div className="flex bg-gray-800 bg-opacity-50 rounded-lg p-0.5 border border-gray-700">
              <button
                onClick={() => setChartType('line')}
                className={`p-1.5 text-xs rounded-md ${
                  chartType === 'line' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`p-1.5 text-xs rounded-md ${
                  chartType === 'area' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-1.5 text-xs rounded-md ${
                  chartType === 'bar' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Bar
              </button>
            </div>
            
            {/* Time range selector */}
            <div className="flex space-x-2">
              {['day', 'week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  className={`px-3 py-1.5 text-xs rounded-md ${
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
        </div>
        
        {/* Chart container */}
        <div className="h-80 w-full">
          {renderChart()}
        </div>
        
        {/* Last updated */}
        <div className="mt-2 text-xs text-gray-400 text-right">
          Last updated: {data.length > 0 ? format(new Date(data[data.length - 1].time), 'MMM d, yyyy h:mm:ss a') : '-'}
        </div>
      </div>
      
      {/* Air quality information section */}
      <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
        <h2 className="text-lg font-medium text-white mb-3">Air Quality Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-primary-300 mb-2">Understanding PPM Readings</h3>
            <p className="text-sm text-gray-300">
              The smoke sensor measures particulate matter and gas concentrations in parts per million (ppm). Higher readings indicate greater concentrations of smoke or other airborne pollutants.
            </p>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-success-500 mr-2"></div>
                <span className="text-xs text-gray-300">0-400 ppm: Good air quality</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div>
                <span className="text-xs text-gray-300">400-1000 ppm: Moderate air quality</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-warning-500 mr-2"></div>
                <span className="text-xs text-gray-300">1000-1500 ppm: Poor air quality</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-danger-500 mr-2"></div>
                <span className="text-xs text-gray-300">Above 1500 ppm: Hazardous conditions</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-warning-300 mb-2">Potential Risks and Actions</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-200">Elevated Readings (400-1000 ppm)</h4>
                <p className="text-xs text-gray-300">
                  Indicates potential issues with ventilation or minor pollutant sources. Consider checking HVAC systems and filters.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-200">High Readings (1000-1500 ppm)</h4>
                <p className="text-xs text-gray-300">
                  Possible equipment malfunction or overheating. Inspect all hardware and consider additional cooling or ventilation.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-200">Critical Readings (1500+ ppm)</h4>
                <div className="flex items-center text-xs text-danger-300">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span>Potential fire risk. Immediate evacuation may be required. Inspect all systems for signs of overheating or fire.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnalyticsLayout>
  );
};

export default AirQualityAnalytics;
