const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const proxy = require('express-http-proxy');
const winston = require('winston');
const config = require('./config/config');

// Create Express app
const app = express();

// Logger configuration
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (config.env !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// User Service Routes
app.use('/api/users', proxy(config.services.user.url, {
  proxyReqPathResolver: (req) => req.originalUrl,
  proxyErrorHandler: (err, res, next) => {
    console.error('Proxy Error:', err);
    next(err);
  }
}));

// Vehicle Service Routes
app.use('/api/vehicles', proxy(config.services.vehicle.url, {
  proxyReqPathResolver: (req) => req.originalUrl,
  proxyErrorHandler: (err, res, next) => {
    console.error('Proxy Error:', err);
    next(err);
  }
}));

// Booking Service Routes
app.use('/api/bookings', proxy(config.services.booking.url, {
  proxyReqPathResolver: (req) => req.originalUrl,
  proxyErrorHandler: (err, res, next) => {
    console.error('Proxy Error:', err);
    next(err);
  }
}));

// Đặt express.json() ở cuối, chỉ áp dụng cho các route còn lại (nếu cần)
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.env === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(config.port, () => {
  logger.info(`API Gateway is running on port ${config.port}`);
  logger.info(`Environment: ${config.env}`);
  logger.info(`User Service URL: ${config.services.user.url}`);
  logger.info(`Vehicle Service URL: ${config.services.vehicle.url}`);
  logger.info(`Booking Service URL: ${config.services.booking.url}`);
});
