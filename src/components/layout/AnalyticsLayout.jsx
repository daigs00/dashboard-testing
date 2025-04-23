import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Calendar, Download, RefreshCw } from 'lucide-react';

/**
 * Layout component for all analytics pages
 * Provides a consistent header, navigation, and structure
 */
const AnalyticsLayout = ({ 
  title, 
  description, 
  icon: Icon, 
  children,
  isLoading = false,
  onRefresh = () => {},
  actionButton = null
}) => {
  const location = useLocation();
  
  // Get current analytics page for breadcrumb navigation
  const getPageName = () => {
    const path = location.pathname.split('/').pop();
    switch (path) {
      case 'temperature': return 'Temperature';
      case 'humidity': return 'Humidity';
      case 'air-quality': return 'Air Quality';
      case 'access-control': return 'Access Control';
      default: return 'Overview';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-glass rounded-xl p-5 border border-gray-800 text-white">
        <div className="flex items-center">
          <div className="flex-1">
            {/* Breadcrumb navigation */}
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <Link to="/" className="hover:text-white">Dashboard</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link to="/analytics" className="hover:text-white">Analytics</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-white">{getPageName()}</span>
            </div>
            
            {/* Title and description */}
            <div className="flex items-start">
              {Icon && (
                <div className="p-2 mr-4 rounded-lg bg-primary-900 bg-opacity-30 text-primary-400 border border-primary-700">
                  <Icon className="w-6 h-6" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-semibold">{title}</h1>
                {description && (
                  <p className="mt-1 text-sm text-gray-300">{description}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Page actions */}
          <div className="flex space-x-2">
            {/* Export button */}
            <button className="flex items-center space-x-1 px-3 py-1.5 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-sm font-medium text-gray-200 hover:bg-gray-700 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <Calendar className="w-4 h-4" />
              <span>Date Range</span>
            </button>
            
            <button className="flex items-center space-x-1 px-3 py-1.5 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-sm font-medium text-gray-200 hover:bg-gray-700 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            {/* Refresh button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-secondary-600 to-primary-600 rounded-lg text-sm font-medium text-white hover:from-secondary-500 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            
            {/* Custom action button if provided */}
            {actionButton}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      {children}
    </div>
  );
};

export default AnalyticsLayout;
