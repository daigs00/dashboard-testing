import fs from 'fs';
import path from 'path';

// Plugin to serve sensor data from local files
export default function sensorDataPlugin() {
  return {
    name: 'sensor-data-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Handle API requests for sensor data
        if (req.url.startsWith('/api/sensor/')) {
          const sensorType = req.url.split('/').pop();
          
          // Map sensor types to file paths
          const sensorFiles = {
            'smoke': '/home/capstone/smoke.json',
            'temperature': '/home/capstone/temp.json',
            'humidity': '/home/capstone/humidity.json'
          };
          
          const filePath = sensorFiles[sensorType];
          
          if (!filePath) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: `Sensor type '${sensorType}' not found` }));
            return;
          }
          
          // Read the file
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.error(`Error reading ${sensorType} data:`, err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: `Failed to read ${sensorType} data` }));
              return;
            }
            
            try {
              // Parse the JSON data (validates it's proper JSON)
              const jsonData = JSON.parse(data);
              
              // Set headers
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(jsonData));
            } catch (parseErr) {
              console.error(`Error parsing ${sensorType} data:`, parseErr);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: `Failed to parse ${sensorType} data` }));
            }
          });
        } 
        // Handle RFID access logs
        else if (req.url === '/api/security/rfid-logs') {
          // Path to the server log file
          const logFilePath = '/home/capstone/server.log';
          
          // Read the file
          fs.readFile(logFilePath, 'utf8', (err, data) => {
            if (err) {
              console.error('Error reading RFID access logs:', err);
              
              // For development, provide mock data if the file can't be read
              if (err.code === 'ENOENT') {
                const mockLogData = `2025-04-23 02:21:19,402 - INFO - Using Wi-Fi interface: wlp5s0
2025-04-23 02:21:19,403 - INFO - Generated hostapd configuration at /tmp/hostapd.conf
2025-04-23 02:21:19,403 - INFO - Generated dnsmasq configuration at /tmp/dnsmasq.conf 
2025-04-23 02:21:47,489 - INFO - Received: AUTH:83151058:1111
2025-04-23 02:21:47,489 - INFO - Access Granted
2025-04-23 02:21:47,489 - INFO - Connection closed
2025-04-23 02:22:01,887 - INFO - Received: AUTH:83151058:0000
2025-04-23 02:22:01,887 - INFO - Access denied
2025-04-23 02:22:01,887 - INFO - Connection closed
2025-04-23 02:22:12,092 - INFO - Received: AUTH:83151058:1111
2025-04-23 02:22:12,092 - INFO - Access Granted
2025-04-23 02:22:12,092 - INFO - Connection closed`;
                
                res.setHeader('Content-Type', 'text/plain');
                res.statusCode = 200;
                res.end(mockLogData);
                return;
              }
              
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to read RFID access logs' }));
              return;
            }
            
            // Set headers
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 200;
            res.end(data);
          });
        } else {
          next();
        }
      });
    }
  };
}
