import React, { useState } from 'react';
import { Grid, List, RefreshCw, Download, Filter, ChevronDown } from 'lucide-react';
import SensorCard from '../components/dashboard/SensorCard';
import MetricCard from '../components/dashboard/MetricCard';
import RFIDAccessCard from '../components/security/RFIDAccessCard';
import AuthMonitorCard from '../components/security/AuthMonitorCard';

const Dashboard = () => {
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // This would typically come from an API
  const sensors = [
    { 
      id: 1, 
      name: 'Temperature Sensor', 
      type: 'temperature',
      location: 'Server Room',
      value: 23.5,
      unit: '°C',
      status: 'normal',
      lastUpdated: new Date().toISOString()
    },
    { 
      id: 2, 
      name: 'Humidity Sensor', 
      type: 'humidity',
      location: 'Server Room',
      value: 45,
      unit: '%',
      status: 'normal',
      lastUpdated: new Date().toISOString()
    },
    { 
      id: 3, 
      name: 'Smoke Detection', 
      type: 'smoke',
      location: 'Server Room',
      value: 5.2,
      unit: 'ppm',
      status: 'normal',
      lastUpdated: new Date().toISOString()
    }
  ];
 

  // Aggregated metrics
  const metrics = [
    { id: 1, name: 'Average Temperature', value: '22.3°C', change: '+0.5°C', isUp: true, detailLink: '/analytics/temperature' },
    { id: 2, name: 'Average Humidity', value: '42%', change: '-3%', isUp: false, detailLink: '/analytics/humidity' },
    { id: 3, name: 'Smoke Level', value: '3.8 ppm', change: '-0.4 ppm', isUp: false, detailLink: '/analytics/smoke' },
    { id: 4, name: 'Access Attempts (24h)', value: '16', change: '+2', isUp: true, detailLink: '/security/access' },
    { id: 5, name: 'Failed Logins (24h)', value: '7', change: '+3', isUp: true, detailLink: '/security/auth' },
    { id: 6, name: 'Door Status', value: 'Locked', change: 'Secure', isUp: false, detailLink: '/security/doors' }
  ];


  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      // Here you would fetch updated data
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard header */}
      <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-glass rounded-xl p-5 border border-gray-800 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Server Room Dashboard</h1>
            <p className="mt-1 text-sm text-gray-300">
              Monitor server room conditions, access control, and security
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-wrap items-center space-x-2">
            {/* Filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-sm font-medium text-gray-200 hover:bg-gray-700 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {filterOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-glass bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg border border-gray-800 focus:outline-none z-10 text-white">
                  <div className="py-1">
                    <div className="px-3 py-2 border-b border-gray-800">
                      <span className="text-xs font-medium text-gray-400">FILTER BY</span>
                    </div>
                    <div className="px-3 py-2">
                      <span className="text-sm font-medium">Status</span>
                      <div className="mt-2 space-y-1">
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-700 rounded bg-gray-800" defaultChecked />
                          <span className="ml-2 text-sm text-gray-300">Normal</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-700 rounded bg-gray-800" defaultChecked />
                          <span className="ml-2 text-sm text-gray-300">Warning</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-700 rounded bg-gray-800" defaultChecked />
                          <span className="ml-2 text-sm text-gray-300">Error</span>
                        </label>
                      </div>
                    </div>
                    <div className="px-3 py-2 border-t border-gray-800">
                      <span className="text-sm font-medium">Location</span>
                      <div className="mt-2 space-y-1">
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-700 rounded bg-gray-800" defaultChecked />
                          <span className="ml-2 text-sm text-gray-300">Server Room</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-700 rounded bg-gray-800" defaultChecked />
                          <span className="ml-2 text-sm text-gray-300">Main Circuit</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-700 rounded bg-gray-800" defaultChecked />
                          <span className="ml-2 text-sm text-gray-300">Main Router</span>
                        </label>
                      </div>
                    </div>
                    <div className="px-3 py-2 border-t border-gray-800 flex justify-between">
                      <button className="text-xs text-gray-400 hover:text-gray-200">
                        Reset filters
                      </button>
                      <button className="text-xs font-medium text-primary-400 hover:text-primary-300">
                        Apply filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* View toggle */}
            <div className="flex items-center bg-gray-800 bg-opacity-50 rounded-lg p-0.5">
              <button
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-md ${
                  view === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded-md ${
                  view === 'list' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            {/* Export button */}
            <button className="flex items-center space-x-1 px-3 py-1.5 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-sm font-medium text-gray-200 hover:bg-gray-700 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-secondary-600 to-primary-600 rounded-lg text-sm font-medium text-white hover:from-secondary-500 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Overview section */}
      <div>
        <h2 className="text-lg font-medium text-white mb-3 pl-1">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map(metric => (
            <MetricCard 
              key={metric.id}
              name={metric.name}
              value={metric.value}
              change={metric.change}
              isUp={metric.isUp}
              detailLink={metric.detailLink}
            />
          ))}
        </div>
      </div>
      
      {/* Sensors section */}
      <div>
        <h2 className="text-lg font-medium text-white mb-3 pl-1">Environmental Monitoring</h2>
        <div className={view === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5"
          : "space-y-4"
        }>
          {sensors.map(sensor => (
            <SensorCard 
              key={sensor.id}
              sensor={sensor}
              viewType={view}
            />
          ))}
        </div>
      </div>
      
      {/* Security Monitoring section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-white mb-3 pl-1">Security Monitoring</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <RFIDAccessCard />
          <AuthMonitorCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
