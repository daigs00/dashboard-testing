# Sensor Dashboard with Real-Time Data

A React-based dashboard for monitoring sensor data with real-time updates from JSON files.

## Overview

This project consists of two parts:
1. A React frontend for visualizing sensor data
2. A simple Express backend that serves sensor data from JSON files

The application polls for updates from the server to provide real-time monitoring of sensor readings.

## Project Structure

```
sensor-dashboard/
├── frontend/         # React frontend application
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       └── services/  # API services for fetching sensor data
├── server/           # Express backend server
│   ├── server.js     # Main server file
│   └── package.json  # Server dependencies
└── README.md
```

## Prerequisites

- Node.js v18 or higher
- npm or yarn

## Installation

### 1. Set up the Backend Server

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Start the server
npm start
```

The server will run on http://localhost:5000 by default.

### 2. Set up the Frontend Application

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on http://localhost:5173 by default.

## Configuration

### Sensor JSON File Location

The server is configured to read sensor data from the following location:
- Smoke sensor: `/home/capstone/logs/smoke.json`

To change this location, edit the `sensorFiles` object in `server/server.js`:

```javascript
const sensorFiles = {
  'smoke': '/path/to/your/smoke.json',
  // Add other sensor types as needed
};
```

### API Endpoint Configuration

The frontend is configured to fetch data from `http://localhost:5000/api`. If your server is running on a different URL, update the `API_BASE_URL` in `frontend/src/services/sensorDataService.js`.

## JSON Data Format

The application expects the smoke sensor JSON file to have the following format:

```json
{
  "readings": [
    {
      "807.17ppm": "2025-04-22 13:47:43"
    },
    {
      "1101.86ppm": "2025-04-22 13:47:45"
    },
    ...
  ]
}
```

Each reading is an object with a single key-value pair where:
- The key is the sensor reading with units (e.g., "807.17ppm")
- The value is the timestamp when the reading was taken

## Polling Frequency

The application is configured with the following polling frequencies:

- SensorChart component: 5 seconds
- SensorCard component: 10 seconds
- Dashboard component: 15 seconds

You can adjust these values by modifying the interval values in the respective components.

## Future Improvements

- Add support for more sensor types
- Implement WebSockets for real-time updates instead of polling
- Add authentication for API endpoints
- Implement data aggregation and analytics
- Add support for setting alerts and notifications based on sensor values
