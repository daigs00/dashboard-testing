import React, { useState, useEffect, useRef } from 'react';
import { Shield, Clock, User, AlertCircle, Check, X, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { fetchRFIDAccessLogs, parseRFIDAccessLogs, getRFIDAccessStats } from '../../services/rfidAccessService';

const RFIDAccessCard = () => {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accessHistory, setAccessHistory] = useState([]);
  const [rfidStatus, setRfidStatus] = useState({
    status: 'loading',
    lastCheck: new Date().toISOString(),
    doorLocked: true,
    failedAttempts: 0,
    successfulAccesses: 0
  });
  
  // Use a ref to store the interval ID for cleanup
  const pollingInterval = useRef(null);
  
  // Load RFID access log data
  useEffect(() => {
    const loadRFIDData = async () => {
      try {
        // Fetch the raw log data
        const response = await fetchRFIDAccessLogs();
        
        // Parse the log data to extract access attempts
        const parsedLogs = parseRFIDAccessLogs(response);
        
        // Update access history
        setAccessHistory(parsedLogs);
        
        // Calculate stats
        const stats = getRFIDAccessStats(parsedLogs);
        setRfidStatus(stats);
      } catch (error) {
        console.error('Failed to load RFID access data:', error);
        setRfidStatus(prev => ({
          ...prev,
          status: 'offline'
        }));
      }
    };
    
    // Initial data load
    loadRFIDData();
    
    // Set up polling interval (every 10 seconds)
    pollingInterval.current = setInterval(loadRFIDData, 10000);
    
    // Clean up interval on unmount
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);
  
  // Handle manual refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      // Fetch the raw log data
      const response = await fetchRFIDAccessLogs();
      
      // Parse the log data to extract access attempts
      const parsedLogs = parseRFIDAccessLogs(response);
      
      // Update access history
      setAccessHistory(parsedLogs);
      
      // Calculate stats
      const stats = getRFIDAccessStats(parsedLogs);
      setRfidStatus(stats);
    } catch (error) {
      console.error('Failed to refresh RFID access data:', error);
      setRfidStatus(prev => ({
        ...prev,
        status: 'offline'
      }));
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };
  
  const getStatusColor = (status) => {
    if (status === 'online') return 'text-success-400 bg-success-900 bg-opacity-30 border-success-700';
    if (status === 'offline') return 'text-danger-400 bg-danger-900 bg-opacity-30 border-danger-700';
    if (status === 'loading') return 'text-gray-400 bg-gray-800 bg-opacity-50 border-gray-700';
    return 'text-warning-400 bg-warning-900 bg-opacity-30 border-warning-700';
  };
  
  const getAccessColor = (status) => {
    if (status === 'success') return 'text-success-400 bg-success-900 bg-opacity-30 border-success-700';
    return 'text-danger-400 bg-danger-900 bg-opacity-30 border-danger-700';
  };
  
  // Format the last updated time
  const lastUpdatedFormatted = format(new Date(rfidStatus.lastCheck), 'MMM d, h:mm a');
  
  // Get the top 5 most recent entries for display
  const recentAccessHistory = accessHistory.slice(0, 5);
  
  return (
    <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass border border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-700">
      <div 
        className="px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-primary-900 bg-opacity-30 text-primary-400 border border-primary-700`}>
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-white">RFID Access Control</h3>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              Last check: {lastUpdatedFormatted}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(rfidStatus.status)}`}>
              {rfidStatus.status.charAt(0).toUpperCase() + rfidStatus.status.slice(1)}
            </span>
            <div className="text-xs text-gray-400 mt-1">
              Door: {rfidStatus.doorLocked ? 'Locked' : 'Unlocked'}
            </div>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-white">Access Control Status</h4>
            <button
              className="p-1.5 text-gray-400 hover:text-gray-200 rounded-full hover:bg-gray-800 hover:bg-opacity-50"
              onClick={(e) => {
                e.stopPropagation();
                handleRefresh();
              }}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Failed Attempts (24h)</div>
              <div className="text-xl font-bold text-danger-400">{rfidStatus.failedAttempts}</div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Successful Access (24h)</div>
              <div className="text-xl font-bold text-success-400">{rfidStatus.successfulAccesses}</div>
            </div>
          </div>
          
          <div className="mb-3">
            <h4 className="text-sm font-medium text-white mb-2">Recent Access History</h4>
            {rfidStatus.status === 'loading' ? (
              <div className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 p-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                <span className="ml-2 text-sm text-gray-400">Loading access history...</span>
              </div>
            ) : accessHistory.length === 0 ? (
              <div className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 p-4 text-center text-sm text-gray-400">
                No access history found
              </div>
            ) : (
              <div className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 divide-y divide-gray-700">
                {recentAccessHistory.map((entry) => (
                  <div key={entry.id} className="p-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded-full ${getAccessColor(entry.status)}`}>
                        {entry.status === 'success' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      </div>
                      <div>
                        <div className="text-sm text-white">{entry.user}</div>
                        <div className="text-xs text-gray-400">
                          <span className="font-mono">ID: {entry.cardId}</span>
                          {entry.pin && <span className="ml-2 text-gray-500">PIN: {entry.pin}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {accessHistory.length > 5 && (
            <div className="text-xs text-right">
              <Link to="/security/rfid-access" className="text-primary-400 hover:text-primary-300">
                View all access records ({accessHistory.length}) →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RFIDAccessCard;
