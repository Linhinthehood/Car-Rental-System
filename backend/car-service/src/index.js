require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const winston = require('winston');

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

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'car-service' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  logger.info(`Car service is running on port ${PORT}`);
});
