import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertCircle, Download, Calendar, ChevronDown, Filter } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';
import AnalyticsLayout from '../../components/layout/AnalyticsLayout';
import { fetchRFIDAccessLogs, parseRFIDAccessLogs, getRFIDAccessStats } from '../../services/rfidAccessService';

const AccessControlAnalytics = () => {
  const [accessHistory, setAccessHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('day');
  const [chartType, setChartType] = useState('bar'); // 'bar', 'pie', 'line'
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    successRate: 0,
    doorLocked: true,
    lastCheck: new Date().toISOString()
  });
  
  // Use a ref to store the interval ID for cleanup
  const pollingInterval = useRef(null);
  
  // Fetch RFID access data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch the raw log data
        const response = await fetchRFIDAccessLogs();
        
        // Parse the log data to extract access attempts
        const parsedLogs = parseRFIDAccessLogs(response);
        
        // Update access history
        setAccessHistory(parsedLogs);
        
        // Calculate stats
        const stats = getRFIDAccessStats(parsedLogs);
        
        const total = parsedLogs.length;
        const successful = parsedLogs.filter(log => log.status === 'success').length;
        const failed = parsedLogs.filter(log => log.status === 'failed').length;
        const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;
        
        setStats({
          total,
          successful,
          failed,
          successRate,
          doorLocked: stats.doorLocked,
          lastCheck: stats.lastCheck
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching RFID access data:', err);
        setError('Failed to load access control data');
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
    fetchRFIDAccessLogs()
      .then(response => {
        const parsedLogs = parseRFIDAccessLogs(response);
        setAccessHistory(parsedLogs);
        
        const stats = getRFIDAccessStats(parsedLogs);
        
        const total = parsedLogs.length;
        const successful = parsedLogs.filter(log => log.status === 'success').length;
        const failed = parsedLogs.filter(log => log.status === 'failed').length;
        const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;
        
        setStats({
          total,
          successful,
          failed,
          successRate,
          doorLocked: stats.doorLocked,
          lastCheck: stats.lastCheck
        });
        
        setError(null);
      })
      .catch(err => {
        console.error('Error refreshing RFID access data:', err);
        setError('Failed to refresh access control data');
      })
      .finally(() => {
        setLoading(false);
        // Restart polling
        pollingInterval.current = setInterval(() => {
          handleRefresh();
        }, 30000);
      });
  };
  
  // Transform access history into chart data
  const prepareChartData = () => {
    if (!accessHistory || accessHistory.length === 0) {
      return [];
    }
    
    // For pie chart
    if (chartType === 'pie') {
      return [
        { name: 'Successful', value: stats.successful, color: '#10B981' },
        { name: 'Failed', value: stats.failed, color: '#EF4444' }
      ];
    }
    
    // For line and bar charts, group by time
    const now = new Date();
    let timeFormat, timeWindow;
    
    switch (timeRange) {
      case 'day':
        timeFormat = 'HH:00'; // Group by hour
        timeWindow = 24 * 60 * 60 * 1000; // 24 hours
        break;
      case 'week':
        timeFormat = 'EEE'; // Group by day of week
        timeWindow = 7 * 24 * 60 * 60 * 1000; // 7 days
        break;
      case 'month':
        timeFormat = 'dd MMM'; // Group by day
        timeWindow = 30 * 24 * 60 * 60 * 1000; // 30 days
        break;
      case 'year':
        timeFormat = 'MMM'; // Group by month
        timeWindow = 365 * 24 * 60 * 60 * 1000; // 365 days
        break;
      default:
        timeFormat = 'HH:00';
        timeWindow = 24 * 60 * 60 * 1000;
    }
    
    // Filter by time range
    const cutoffTime = new Date(now.getTime() - timeWindow);
    const filteredHistory = accessHistory.filter(entry => 
      new Date(entry.timestamp) >= cutoffTime
    );
    
    // Group by time unit
    const groupedData = {};
    
    filteredHistory.forEach(entry => {
      const date = new Date(entry.timestamp);
      const timeKey = format(date, timeFormat);
      
      if (!groupedData[timeKey]) {
        groupedData[timeKey] = { 
          time: timeKey, 
          successful: 0, 
          failed: 0,
          total: 0 
        };
      }
      
      if (entry.status === 'success') {
        groupedData[timeKey].successful += 1;
      } else {
        groupedData[timeKey].failed += 1;
      }
      
      groupedData[timeKey].total += 1;
    });
    
    // Convert to array and sort by time
    return Object.values(groupedData).sort((a, b) => {
      if (timeRange === 'week') {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.indexOf(a.time) - days.indexOf(b.time);
      }
      return a.time.localeCompare(b.time);
    });
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg px-3 py-2 rounded-lg border border-gray-800 shadow-lg text-white">
          <p className="text-xs font-medium text-gray-400">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Custom pie label
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  // Chart data
  const chartData = prepareChartData();
  
  // Render appropriate chart based on selected chart type
  const renderChart = () => {
    if (loading && chartData.length === 0) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      );
    }
    
    if (error && chartData.length === 0) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-danger-400">
          <AlertCircle className="h-8 w-8 mb-2" />
          <span>{error}</span>
        </div>
      );
    }
    
    if (chartData.length === 0) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-gray-400">
          <Shield className="h-12 w-12 mb-2" />
          <span>No access data available for the selected time range</span>
        </div>
      );
    }
    
    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={{ stroke: '#4B5563' }}
                axisLine={{ stroke: '#4B5563' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={{ stroke: '#4B5563' }}
                axisLine={{ stroke: '#4B5563' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="successful" 
                name="Successful"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 2, fill: '#10B981', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 1 }}
              />
              <Line 
                type="monotone" 
                dataKey="failed" 
                name="Failed"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ r: 2, fill: '#EF4444', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#EF4444', stroke: '#fff', strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={{ stroke: '#4B5563' }}
                axisLine={{ stroke: '#4B5563' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={{ stroke: '#4B5563' }}
                axisLine={{ stroke: '#4B5563' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="successful" 
                name="Successful" 
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="failed" 
                name="Failed" 
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };
  
  return (
    <AnalyticsLayout
      title="Access Control Analytics"
      description="Building access and security monitoring"
      icon={Shield}
      isLoading={loading}
      onRefresh={handleRefresh}
    >
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Door Status</h3>
          <div className="mt-2 flex items-center">
            <span className="text-2xl font-bold text-white">
              {stats.doorLocked ? 'Locked' : 'Unlocked'}
            </span>
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
              stats.doorLocked 
                ? 'bg-success-900 bg-opacity-30 text-success-300 border border-success-700' 
                : 'bg-warning-900 bg-opacity-30 text-warning-300 border border-warning-700'
            }`}>
              {stats.doorLocked ? 'Secure' : 'Open'}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Success Rate</h3>
          <div className="mt-2 flex items-center">
            <span className="text-2xl font-bold text-white">{stats.successRate}%</span>
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Successful Access</h3>
          <div className="mt-2 flex items-center">
            <span className="text-2xl font-bold text-success-400">{stats.successful}</span>
            <span className="ml-2 text-sm text-gray-400">of {stats.total}</span>
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Failed Attempts</h3>
          <div className="mt-2 flex items-center">
            <span className="text-2xl font-bold text-danger-400">{stats.failed}</span>
            <span className="ml-2 text-sm text-gray-400">of {stats.total}</span>
          </div>
        </div>
      </div>
      
      {/* Chart section */}
      <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <h2 className="text-lg font-medium text-white">Access Trends</h2>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            {/* Chart type selector */}
            <div className="flex bg-gray-800 bg-opacity-50 rounded-lg p-0.5 border border-gray-700">
              <button
                onClick={() => setChartType('bar')}
                className={`p-1.5 text-xs rounded-md ${
                  chartType === 'bar' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Bar
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-1.5 text-xs rounded-md ${
                  chartType === 'line' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`p-1.5 text-xs rounded-md ${
                  chartType === 'pie' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Pie
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
          Last updated: {format(new Date(stats.lastCheck), 'MMM d, yyyy h:mm:ss a')}
        </div>
      </div>
      
      {/* Recent access section */}
      <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-white">Recent Access Attempts</h2>
          
          <button className="flex items-center space-x-1 px-3 py-1.5 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-sm font-medium text-gray-200 hover:bg-gray-700 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
        
        {loading && accessHistory.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : accessHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Shield className="h-10 w-10 mb-2" />
            <span>No access history available</span>
          </div>
        ) : (
          <div className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 divide-y divide-gray-700">
            {accessHistory.slice(0, 5).map((entry) => (
              <div key={entry.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded-full ${
                    entry.status === 'success' 
                      ? 'bg-success-900 bg-opacity-30 text-success-400 border border-success-700' 
                      : 'bg-danger-900 bg-opacity-30 text-danger-400 border border-danger-700'
                  }`}>
                    {entry.status === 'success' ? (
                      <div className="h-3 w-3 rounded-full bg-success-400"></div>
                    ) : (
                      <div className="h-3 w-3 rounded-full bg-danger-400"></div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-white">{entry.user}</div>
                    <div className="text-xs text-gray-400">ID: {entry.cardId}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white">
                    {entry.status === 'success' ? 'Access Granted' : 'Access Denied'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {accessHistory.length > 5 && (
          <div className="mt-4 text-center">
            <a 
              href="/security/rfid-access" 
              className="inline-flex items-center text-primary-400 hover:text-primary-300"
            >
              View all {accessHistory.length} access logs
              <ChevronDown className="ml-1 h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </AnalyticsLayout>
  );
};

export default AccessControlAnalytics;
