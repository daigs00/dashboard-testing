import React, { useState } from 'react';
import { Shield, Clock, User, AlertCircle, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

const RFIDAccessCard = () => {
  const [expanded, setExpanded] = useState(false);
  
  // Mock RFID access data - would come from API in real app
  const rfidStatus = {
    status: 'online',
    lastCheck: new Date().toISOString(),
    doorLocked: true,
    failedAttempts: 2,
    successfulAccesses: 14
  };
  
  // Mock access history - would come from API in real app
  const accessHistory = [
    { id: 1, timestamp: new Date(Date.now() - 15 * 60000).toISOString(), user: 'John Smith', cardId: 'A7F392C1', status: 'success' },
    { id: 2, timestamp: new Date(Date.now() - 47 * 60000).toISOString(), user: 'Unknown', cardId: 'B3D591A2', status: 'failed' },
    { id: 3, timestamp: new Date(Date.now() - 72 * 60000).toISOString(), user: 'Jane Wilson', cardId: 'C5E721B3', status: 'success' },
    { id: 4, timestamp: new Date(Date.now() - 120 * 60000).toISOString(), user: 'Unknown', cardId: 'Invalid', status: 'failed' },
    { id: 5, timestamp: new Date(Date.now() - 180 * 60000).toISOString(), user: 'Mike Johnson', cardId: 'D2F819C4', status: 'success' },
  ];
  
  const getStatusColor = (status) => {
    if (status === 'online') return 'text-success-400 bg-success-900 bg-opacity-30 border-success-700';
    if (status === 'offline') return 'text-danger-400 bg-danger-900 bg-opacity-30 border-danger-700';
    return 'text-warning-400 bg-warning-900 bg-opacity-30 border-warning-700';
  };
  
  const getAccessColor = (status) => {
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
          <div className={`p-2 rounded-lg bg-primary-900 bg-opacity-30 text-primary-400 border border-primary-700`}>
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-white">RFID Access Control</h3>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              Last check: {format(new Date(rfidStatus.lastCheck), 'MMM d, h:mm a')}
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
            <div className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 divide-y divide-gray-700">
              {accessHistory.map((entry) => (
                <div key={entry.id} className="p-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded-full ${getAccessColor(entry.status)}`}>
                      {entry.status === 'success' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className="text-sm text-white">{entry.user}</div>
                      <div className="text-xs text-gray-400">ID: {entry.cardId}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-right">
            <button className="text-primary-400 hover:text-primary-300">View all access records →</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFIDAccessCard;
