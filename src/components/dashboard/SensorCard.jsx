import React, { useState } from 'react';
import { Thermometer, Droplet, Wind, MapPin, Clock, ChevronDown, ChevronUp, Settings, RefreshCw } from 'lucide-react';
import SensorChart from './SensorChart';
import { format } from 'date-fns';

const SensorCard = ({ sensor, viewType = 'grid' }) => {
  const [timeRange, setTimeRange] = useState('day');
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Icon mapping based on sensor type
  const iconMap = {
    temperature: Thermometer,
    humidity: Droplet,
    smoke: Wind
  };
  
  // Color mapping based on status
  const statusColors = {
    normal: {
      bg: 'bg-success-900 bg-opacity-30',
      text: 'text-success-300',
      icon: 'text-success-400',
      border: 'border-success-700',
      gradient: 'from-success-900 to-success-700'
    },
    warning: {
      bg: 'bg-warning-900 bg-opacity-30',
      text: 'text-warning-300',
      icon: 'text-warning-400',
      border: 'border-warning-700',
      gradient: 'from-warning-900 to-warning-700'
    },
    error: {
      bg: 'bg-danger-900 bg-opacity-30',
      text: 'text-danger-300',
      icon: 'text-danger-400',
      border: 'border-danger-700',
      gradient: 'from-danger-900 to-danger-700'
    }
  };
  
  // Get the icon component based on type
  const SensorIcon = iconMap[sensor.type] || Activity;
  
  // Format the last updated time
  const lastUpdatedFormatted = format(new Date(sensor.lastUpdated), 'MMM d, h:mm a');
  
  // Handle refresh data
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  if (viewType === 'list') {
    return (
      <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass border border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-700">
        <div 
          className="px-4 py-3 flex justify-between items-center cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${statusColors[sensor.status].bg} ${statusColors[sensor.status].icon} border ${statusColors[sensor.status].border}`}>
              <SensorIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-white">{sensor.name}</h3>
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="w-3 h-3 mr-1" />
                {sensor.location}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-lg font-semibold text-white">{sensor.value} {sensor.unit}</div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[sensor.status].bg} ${statusColors[sensor.status].text} border ${statusColors[sensor.status].border}`}>
                {sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)}
              </span>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </div>
        
        {expanded && (
          <div className="px-4 pb-4 border-t border-gray-800 pt-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex space-x-2">
                {['day', 'week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    className={`px-2 py-1 text-xs rounded-md ${
                      timeRange === range 
                        ? 'bg-primary-800 bg-opacity-70 text-primary-300 border border-primary-700' 
                        : 'bg-gray-800 bg-opacity-50 text-gray-400 hover:bg-gray-700 hover:bg-opacity-50 border border-gray-700'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTimeRange(range);
                    }}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <button
                  className="p-1.5 text-gray-400 hover:text-gray-200 rounded-full hover:bg-gray-800 hover:bg-opacity-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRefresh();
                  }}
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  className="p-1.5 text-gray-400 hover:text-gray-200 rounded-full hover:bg-gray-800 hover:bg-opacity-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="h-48 bg-gray-800 bg-opacity-50 rounded-lg p-2 border border-gray-700">
              <SensorChart 
                sensorId={sensor.id}
                sensorType={sensor.type}
                timeRange={timeRange}
                unit={sensor.unit}
              />
            </div>
            
            <div className="mt-2 flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              Last updated: {lastUpdatedFormatted}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Grid view
  return (
    <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass border border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-700">
      <div className="px-4 pt-4 flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${statusColors[sensor.status].bg} ${statusColors[sensor.status].icon} border ${statusColors[sensor.status].border}`}>
            <SensorIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-white">{sensor.name}</h3>
            <div className="flex items-center text-sm text-gray-400">
              <MapPin className="w-3 h-3 mr-1" />
              {sensor.location}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-1">
          <button
            className="p-1.5 text-gray-400 hover:text-gray-200 rounded-full hover:bg-gray-800 hover:bg-opacity-50"
            onClick={handleRefresh}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-200 rounded-full hover:bg-gray-800 hover:bg-opacity-50">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="px-4 py-3 flex items-center">
        <div className="text-2xl font-bold text-white">{sensor.value} {sensor.unit}</div>
        <span className={`ml-2 text-xs px-2 py-1 rounded-full ${statusColors[sensor.status].bg} ${statusColors[sensor.status].text} border ${statusColors[sensor.status].border}`}>
          {sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)}
        </span>
      </div>
      
      <div className="px-4 pb-4">
        <div className="flex space-x-2 mb-3">
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              className={`px-2 py-1 text-xs rounded-md ${
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
        
        <div className="h-48 bg-gray-800 bg-opacity-50 rounded-lg p-2 border border-gray-700">
          <SensorChart 
            sensorId={sensor.id}
            sensorType={sensor.type}
            timeRange={timeRange}
            unit={sensor.unit}
          />
        </div>
        
        <div className="mt-2 flex items-center text-xs text-gray-400">
          <Clock className="w-3 h-3 mr-1" />
          Last updated: {lastUpdatedFormatted}
        </div>
      </div>
    </div>
  );
};

export default SensorCard;
