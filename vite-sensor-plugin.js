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
        } else {
          next();
        }
      });
    }
  };
}
