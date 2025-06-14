const express = require('express');
const cors = require('cors');
const winston = require('winston');
const config = require('./config/config');
const connectDB = require('./config/database');
const path = require('path');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (config.nodeEnv !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Connect to MongoDB
connectDB();

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'vehicle-service' });
});

// Vehicle routes
const vehicleRoutes = require('./routes/vehicle.routes');
app.use('/api/vehicles', vehicleRoutes);

// Static file serving
const uploadDir = process.env.UPLOAD_VEHICLE_PATH || '/usr/src/app/uploads/vehicles';
const uploadPublicUrl = process.env.UPLOAD_VEHICLE_URL || '/uploads/vehicles';
app.use(uploadPublicUrl, require('express').static(uploadDir));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`Vehicle service is running on port ${PORT}`);
});
