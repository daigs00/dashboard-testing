import axios from 'axios';

/**
 * Fetches RFID access log data from the server
 * @returns {Promise<Array>} Array of access attempts
 */
export const fetchRFIDAccessLogs = async () => {
  try {
    // In a real implementation, you would have an API endpoint to get the log data
    // For development/testing, we're simulating this by directly reading the file
    const response = await axios.get('/api/security/rfid-logs');
    return response.data;
  } catch (error) {
    console.error('Error fetching RFID access logs:', error);
    throw error;
  }
};

/**
 * Parses the server log file for RFID access attempts
 * @param {string} logContent - Raw log file content
 * @returns {Array} - Array of parsed access attempts
 */
export const parseRFIDAccessLogs = (logContent) => {
  const lines = logContent.split('\n');
  const accessAttempts = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for the pattern "Received: AUTH:{RFID}:{PIN}"
    if (line.includes('Received: AUTH:')) {
      // Extract the timestamp, replacing comma with period for milliseconds
      const timestampMatch = /(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}),(\d+)/.exec(line);
      const timestamp = timestampMatch ? 
        `${timestampMatch[1]}.${timestampMatch[2]}` : 
        line.split(' - ')[0];
      
      // Extract the RFID code and PIN
      const authMatch = line.match(/Received: AUTH:([^:]+):([^:]+)/);
      
      if (authMatch && authMatch.length >= 3) {
        const rfidCode = authMatch[1];
        const pin = authMatch[2];
        
        // Look for the next line to determine if access was granted or denied
        let accessStatus = 'unknown';
        let userName = rfidCode; // Use RFID as user name since actual names aren't available
        
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          if (nextLine.includes('Access Granted')) {
            accessStatus = 'success';
            userName = `Card #${rfidCode}`; // Format nicely for display
          } else if (nextLine.includes('Access denied') || nextLine.includes('Access Denied')) {
            accessStatus = 'failed';
            userName = `Card #${rfidCode} (Invalid PIN)`;
          }
        }
        
        // Add this access attempt to our array
        accessAttempts.push({
          id: accessAttempts.length + 1, // Generate an ID for the entry
          timestamp: new Date(timestamp).toISOString(),
          cardId: rfidCode,
          pin: pin,
          user: userName,
          status: accessStatus
        });
      }
    }
  }
  
  // Sort by timestamp descending (most recent first)
  return accessAttempts.sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
};

/**
 * Gets the latest RFID access statistics
 * @param {Array} accessLogs - Parsed access logs
 * @returns {Object} - Statistics about access attempts
 */
export const getRFIDAccessStats = (accessLogs) => {
  if (!accessLogs || !accessLogs.length) {
    return {
      status: 'offline',
      lastCheck: new Date().toISOString(),
      doorLocked: true,
      failedAttempts: 0,
      successfulAccesses: 0
    };
  }
  
  // Get the most recent timestamp as the last check time
  const lastCheck = accessLogs.reduce((latest, current) => {
    const currentDate = new Date(current.timestamp);
    return currentDate > latest ? currentDate : latest;
  }, new Date(0)).toISOString();
  
  // Filter logs from the last 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentLogs = accessLogs.filter(log => 
    new Date(log.timestamp) >= oneDayAgo
  );
  
  // Count successful and failed attempts
  const successfulAccesses = recentLogs.filter(log => log.status === 'success').length;
  const failedAttempts = recentLogs.filter(log => log.status === 'failed').length;
  
  // Determine if the door is currently locked based on the most recent access
  // Assume door is locked by default
  let doorLocked = true;
  if (accessLogs.length > 0) {
    // If the most recent entry was a successful access, consider the door unlocked
    // This is a simplification - in reality, you might have specific "door locked/unlocked" events
    doorLocked = accessLogs[0].status !== 'success';
  }
  
  return {
    status: 'online', // Assume the system is online if we have logs
    lastCheck,
    doorLocked,
    failedAttempts,
    successfulAccesses
  };
};
