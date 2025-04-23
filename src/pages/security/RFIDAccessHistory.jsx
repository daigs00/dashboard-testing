import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  RefreshCw, 
  Check, 
  X, 
  ChevronDown, 
  ChevronLeft,
  Download,
  Calendar,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fetchRFIDAccessLogs, parseRFIDAccessLogs, getRFIDAccessStats } from '../../services/rfidAccessService';

const RFIDAccessHistory = () => {
  const [accessHistory, setAccessHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'success', 'failed'
  const [rfidStatus, setRfidStatus] = useState({
    status: 'loading',
    lastCheck: new Date().toISOString(),
    doorLocked: true,
    failedAttempts: 0,
    successfulAccesses: 0
  });
  
  // Load RFID access data
  useEffect(() => {
    const loadRFIDData = async () => {
      setIsLoading(true);
      try {
        // Fetch the raw log data
        const response = await fetchRFIDAccessLogs();
        
        // Parse the log data to extract access attempts
        const parsedLogs = parseRFIDAccessLogs(response);
        
        // Update access history
        setAccessHistory(parsedLogs);
        setFilteredHistory(parsedLogs);
        
        // Calculate stats
        const stats = getRFIDAccessStats(parsedLogs);
        setRfidStatus(stats);
      } catch (error) {
        console.error('Failed to load RFID access data:', error);
        setRfidStatus(prev => ({
          ...prev,
          status: 'offline'
        }));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRFIDData();
  }, []);
  
  // Apply filters when search term or status filter changes
  useEffect(() => {
    let filtered = accessHistory;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(entry => entry.status === statusFilter);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.user.toLowerCase().includes(term) || 
        entry.cardId.toLowerCase().includes(term)
      );
    }
    
    setFilteredHistory(filtered);
  }, [accessHistory, searchTerm, statusFilter]);
  
  // Handle refresh button click
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
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper to get status-based styling
  const getStatusColor = (status) => {
    if (status === 'success') return 'text-success-400 bg-success-900 bg-opacity-30 border border-success-700';
    return 'text-danger-400 bg-danger-900 bg-opacity-30 border border-danger-700';
  };
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-glass rounded-xl p-5 border border-gray-800 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="p-2 mr-4 rounded-lg bg-primary-900 bg-opacity-30 text-primary-400 border border-primary-700">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">RFID Access History</h1>
              <p className="mt-1 text-sm text-gray-300">
                View and analyze building access attempts
              </p>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-wrap items-center space-x-2">
            <Link 
              to="/"
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-sm font-medium text-gray-200 hover:bg-gray-700 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-secondary-600 to-primary-600 rounded-lg text-sm font-medium text-white hover:from-secondary-500 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Door Status</h3>
          <div className="mt-2 flex items-end space-x-2">
            <span className="text-2xl font-bold text-white">
              {rfidStatus.doorLocked ? 'Locked' : 'Unlocked'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              rfidStatus.doorLocked 
                ? 'bg-success-900 bg-opacity-30 text-success-300 border border-success-700' 
                : 'bg-warning-900 bg-opacity-30 text-warning-300 border border-warning-700'
            }`}>
              {rfidStatus.doorLocked ? 'Secure' : 'Open'}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Successful Access (24h)</h3>
          <div className="mt-2 flex items-end space-x-2">
            <span className="text-2xl font-bold text-white">{rfidStatus.successfulAccesses}</span>
            <span className="text-xs text-gray-400">Total</span>
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass p-5 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Failed Attempts (24h)</h3>
          <div className="mt-2 flex items-end space-x-2">
            <span className="text-2xl font-bold text-white">{rfidStatus.failedAttempts}</span>
            <span className="text-xs text-gray-400">Total</span>
          </div>
        </div>
      </div>
      
      {/* Access history table */}
      <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-glass border border-gray-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <h2 className="text-lg font-medium text-white">Access Logs</h2>
            
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by user or card ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 rounded-lg text-sm bg-gray-800 bg-opacity-50 border border-gray-700 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              {/* Filter dropdown */}
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-sm font-medium text-gray-200 hover:bg-gray-700 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter: {statusFilter === 'all' ? 'All' : statusFilter === 'success' ? 'Successful' : 'Failed'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {filterOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-glass bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg border border-gray-800 focus:outline-none z-10 text-white">
                    <div className="py-1">
                      <button 
                        className={`block w-full text-left px-4 py-2 text-sm ${statusFilter === 'all' ? 'text-white' : 'text-gray-400'} hover:bg-gray-800`}
                        onClick={() => {
                          setStatusFilter('all');
                          setFilterOpen(false);
                        }}
                      >
                        All Access Attempts
                      </button>
                      <button 
                        className={`block w-full text-left px-4 py-2 text-sm ${statusFilter === 'success' ? 'text-white' : 'text-gray-400'} hover:bg-gray-800`}
                        onClick={() => {
                          setStatusFilter('success');
                          setFilterOpen(false);
                        }}
                      >
                        Successful Only
                      </button>
                      <button 
                        className={`block w-full text-left px-4 py-2 text-sm ${statusFilter === 'failed' ? 'text-white' : 'text-gray-400'} hover:bg-gray-800`}
                        onClick={() => {
                          setStatusFilter('failed');
                          setFilterOpen(false);
                        }}
                      >
                        Failed Only
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Export button */}
              <button className="flex items-center space-x-1 px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-sm font-medium text-gray-200 hover:bg-gray-700 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-2 text-gray-400">Loading access logs...</span>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Shield className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-base font-medium text-white">No access logs found</h3>
              <p className="mt-1 text-sm text-gray-400">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try changing your search or filter criteria'
                  : 'No one has attempted to access the building yet'}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800 bg-opacity-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Card ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 bg-opacity-50 divide-y divide-gray-800">
                {filteredHistory.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-800 hover:bg-opacity-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center rounded-full px-2.5 py-0.5 ${getStatusColor(entry.status)}`}>
                        {entry.status === 'success' ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : (
                          <X className="mr-1 h-3 w-3" />
                        )}
                        <span className="text-xs">
                          {entry.status === 'success' ? 'Granted' : 'Denied'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{entry.user}</div>
                      {entry.pin && (
                        <div className="text-xs text-gray-400">
                          PIN: <span className="font-mono">{entry.pin}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white font-mono">{entry.cardId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="mr-1 h-3 w-3 text-gray-400" />
                        {format(new Date(entry.timestamp), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <Clock className="mr-1 h-3 w-3 text-gray-400" />
                        {format(new Date(entry.timestamp), 'h:mm:ss a')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {filteredHistory.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-800 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Showing <span className="font-medium text-white">{filteredHistory.length}</span> results
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-400">
                  Last updated: {format(new Date(rfidStatus.lastCheck), 'MMM d, h:mm:ss a')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RFIDAccessHistory;
