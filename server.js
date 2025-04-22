const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API endpoint to get sensor data
app.get('/api/sensor/:type', (req, res) => {
  const sensorType = req.params.type;
  
  // Map of sensor types to file paths
  const sensorFiles = {
    'smoke': '/home/capstone/logs/smoke.json',
    // Add other sensor types as needed
    // 'temperature': '/home/capstone/logs/temperature.json',
    // 'humidity': '/home/capstone/logs/humidity.json',
  };
  
  const filePath = sensorFiles[sensorType];
  
  if (!filePath) {
    return res.status(404).json({ error: `Sensor type '${sensorType}' not found` });
  }
  
  // Read the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading ${sensorType} data:`, err);
      return res.status(500).json({ error: `Failed to read ${sensorType} data` });
    }
    
    try {
      // Parse the JSON data
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseErr) {
      console.error(`Error parsing ${sensorType} data:`, parseErr);
      res.status(500).json({ error: `Failed to parse ${sensorType} data` });
    }
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back the React app's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
