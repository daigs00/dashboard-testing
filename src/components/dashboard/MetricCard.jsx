import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';


const MetricCard = ({ name, value, change, isUp, detailLink }) => {
  // Check if this is a status metric like "Door Status"
  const isStatusMetric = name.includes('Status');

  return (
    <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-gray-700 group">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-400">{name}</h3>
        
        {!isStatusMetric ? (
          <div className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            isUp 
              ? 'bg-success-900 bg-opacity-70 text-success-300 border border-success-700' 
              : 'bg-danger-900 bg-opacity-70 text-danger-300 border border-danger-700'
          }`}>
            {isUp ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            <span>{change}</span>
          </div>
        ) : (
          <div className="flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary-900 bg-opacity-70 text-primary-300 border border-primary-700">
            <LockKeyhole className="w-3 h-3 mr-1" />
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div className="mt-2 flex items-end space-x-2">
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      
      {detailLink && (
        <div className="mt-4 flex items-center text-sm text-primary-400 font-medium group-hover:text-primary-300 transition-colors duration-200">
          <Link to={detailLink} className="flex items-center">
            View details
            <ArrowRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
