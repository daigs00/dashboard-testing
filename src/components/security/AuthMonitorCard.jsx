import React, { useState } from 'react';
import { KeySquare, AlertTriangle, User, Clock, Check, X, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { format } from 'date-fns';

const AuthMonitorCard = () => {
  const [expanded, setExpanded] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'failed', 'success'
  
  // Mock auth stats - would come from API in real app
  const authStats = {
    totalAttempts: 42,
    failedAttempts: 7,
    successfulLogins: 35,
    suspiciousActivities: 3
  };
  
  // Mock login history - would come from API in real app
  const loginHistory = [
    { id: 1, timestamp: new Date(Date.now() - 30 * 60000).toISOString(), user: 'admin@example.com', ip: '192.168.1.105', status: 'success', userAgent: 'Chrome/Windows' },
    { id: 2, timestamp: new Date(Date.now() - 55 * 60000).toISOString(), user: 'unknown@test.com', ip: '45.23.126.85', status: 'failed', userAgent: 'Firefox/MacOS' },
    { id: 3, timestamp: new Date(Date.now() - 120 * 60000).toISOString(), user: 'john@example.com', ip: '192.168.1.98', status: 'success', userAgent: 'Safari/iOS' },
    { id: 4, timestamp: new Date(Date.now() - 180 * 60000).toISOString(), user: 'admin@example.com', ip: '78.45.232.101', status: 'failed', userAgent: 'Unknown/Linux' },
    { id: 5, timestamp: new Date(Date.now() - 240 * 60000).toISOString(), user: 'jane@example.com', ip: '192.168.1.110', status: 'success', userAgent: 'Edge/Windows' },
  ];
  
  // Filter login history based on current filter
  const filteredHistory = filter === 'all' 
    ? loginHistory 
    : loginHistory.filter(entry => entry.status === filter);
  
  const getStatusColor = (status) => {
    if (status === 'success') return 'text-success-400 bg-success-900 bg-opacity-30 border-success-700';
    return 'text-danger-400 bg-danger-900 bg-opacity-30 border-danger-700';
  };

  return (
    <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass border border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-700">
      <div 
        className="px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-secondary-900 bg-opacity-30 text-secondary-400 border border-secondary-700`}>
            <KeySquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-white">Authentication Monitor</h3>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              Last 24 hours: {authStats.totalAttempts} login attempts
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            {authStats.suspiciousActivities > 0 && (
              <span className="px-2 py-1 rounded-full text-xs text-warning-400 bg-warning-900 bg-opacity-30 border border-warning-700">
                {authStats.suspiciousActivities} Suspicious
              </span>
            )}
            <div className="text-xs text-gray-400 mt-1">
              Success rate: {Math.round((authStats.successfulLogins / authStats.totalAttempts) * 100)}%
            </div>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Failed Logins (24h)</div>
              <div className="text-xl font-bold text-danger-400">{authStats.failedAttempts}</div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Successful Logins (24h)</div>
              <div className="text-xl font-bold text-success-400">{authStats.successfulLogins}</div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-white">Recent Login Attempts</h4>
              
              <div className="relative">
                <button
                  className="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-300 px-2 py-1 bg-gray-800 bg-opacity-50 rounded-md border border-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterOpen(!filterOpen);
                  }}
                >
                  <Filter className="w-3 h-3" />
                  <span>
                    {filter === 'all' ? 'All' : filter === 'success' ? 'Successful' : 'Failed'}
                  </span>
                </button>
                
                {filterOpen && (
                  <div className="absolute right-0 mt-1 w-36 bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-md shadow-lg border border-gray-800 z-10">
                    <div className="py-1">
                      <button 
                        className={`block w-full text-left px-4 py-1 text-sm ${filter === 'all' ? 'text-white' : 'text-gray-400'} hover:bg-gray-800`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilter('all');
                          setFilterOpen(false);
                        }}
                      >
                        All
                      </button>
                      <button 
                        className={`block w-full text-left px-4 py-1 text-sm ${filter === 'success' ? 'text-white' : 'text-gray-400'} hover:bg-gray-800`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilter('success');
                          setFilterOpen(false);
                        }}
                      >
                        Successful
                      </button>
                      <button 
                        className={`block w-full text-left px-4 py-1 text-sm ${filter === 'failed' ? 'text-white' : 'text-gray-400'} hover:bg-gray-800`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilter('failed');
                          setFilterOpen(false);
                        }}
                      >
                        Failed
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 divide-y divide-gray-700">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((entry) => (
                  <div key={entry.id} className="p-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded-full ${getStatusColor(entry.status)}`}>
                        {entry.status === 'success' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      </div>
                      <div>
                        <div className="text-sm text-white">{entry.user}</div>
                        <div className="text-xs text-gray-400">IP: {entry.ip}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                      </div>
                      <div className="text-xs text-gray-500">{entry.userAgent}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-400">
                  No {filter} login attempts found
                </div>
              )}
            </div>
          </div>
          
          <div className="text-xs text-right">
            <button className="text-secondary-400 hover:text-secondary-300">View authentication logs →</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthMonitorCard;
