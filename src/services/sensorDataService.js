import axios from 'axios';

/**
 * Fetches sensor data from the API endpoint
 * @param {string} sensorType - Type of sensor (e.g., 'smoke', 'temperature')
 * @returns {Promise<Object>} - Promise that resolves to sensor data
 */
export const fetchSensorData = async (sensorType) => {
  try {
    const response = await axios.get(`/api/sensor/${sensorType}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${sensorType} sensor data:`, error);
    throw error;
  }
};

/**
 * Processes raw smoke sensor data into a format suitable for charts
 * @param {Object} rawData - Raw data from the smoke sensor
 * @param {string} timeRange - Time range to filter data ('day', 'week', 'month', 'year')
 * @returns {Array} - Processed data ready for charting
 */
export const processSmokeSensorData = (rawData, timeRange = 'day') => {
  if (!rawData || !rawData.readings || !Array.isArray(rawData.readings)) {
    return [];
  }
  
  // Get readings and format them for the chart
  let readings = rawData.readings.map(reading => {
    // Extract the first (and only) key-value pair from each reading
    const [value, timestamp] = Object.entries(reading)[0];
    
    // Extract the numeric part from the value (remove 'ppm')
    const numericValue = parseFloat(value.replace('ppm', ''));
    
    // Format the timestamp for display
    const dateObj = new Date(timestamp);
    let formattedTime;
    
    // Format time differently based on timeRange
    switch (timeRange) {
      case 'day':
        formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        break;
      case 'week':
        formattedTime = dateObj.toLocaleDateString([], { weekday: 'short' });
        break;
      case 'month':
        formattedTime = dateObj.toLocaleDateString([], { day: '2-digit', month: 'short' });
        break;
      case 'year':
        formattedTime = dateObj.toLocaleDateString([], { month: 'short' });
        break;
      default:
        formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return {
      time: timestamp,
      formattedTime,
      value: numericValue
    };
  });
  
  // Filter readings based on time range if needed
  const now = new Date();
  
  switch (timeRange) {
    case 'day':
      // Filter readings from the last 24 hours
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      readings = readings.filter(reading => new Date(reading.time) >= oneDayAgo);
      break;
    case 'week':
      // Filter readings from the last 7 days
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      readings = readings.filter(reading => new Date(reading.time) >= oneWeekAgo);
      break;
    case 'month':
      // Filter readings from the last 30 days
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      readings = readings.filter(reading => new Date(reading.time) >= oneMonthAgo);
      break;
    // For 'year', we could filter for the last 365 days, but we'll keep all readings for now
  }
  
  // If we have too many data points, we might want to sample them
  if (readings.length > 50) {
    const samplingRate = Math.ceil(readings.length / 50);
    readings = readings.filter((_, index) => index % samplingRate === 0);
  }
  
  // Sort by timestamp to ensure chronological order
  readings.sort((a, b) => new Date(a.time) - new Date(b.time));
  
  return readings;
};

/**
 * Gets the latest value from sensor data
 * @param {Object} rawData - Raw sensor data
 * @returns {Object} - Latest sensor reading with value and timestamp
 */
export const getLatestSensorReading = (rawData) => {
  if (!rawData || !rawData.readings || !rawData.readings.length) {
    return { value: 0, timestamp: new Date().toISOString() };
  }
  
  // Get the most recent reading (assuming readings are in chronological order)
  const latestReading = rawData.readings[rawData.readings.length - 1];
  const [value, timestamp] = Object.entries(latestReading)[0];
  
  // Extract numeric value
  const numericValue = parseFloat(value.replace('ppm', ''));
  
  return {
    value: numericValue,
    unit: 'ppm',
    timestamp,
    // Determine status based on value
    status: numericValue < 1000 ? 'normal' : numericValue < 1500 ? 'warning' : 'error'
  };
};
