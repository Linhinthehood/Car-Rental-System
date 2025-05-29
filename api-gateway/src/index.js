require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

// Create Express app
const app = express();

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

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Proxy configuration
const services = {
  user: process.env.USER_SERVICE_URL || 'http://user-service:3001',
  car: process.env.CAR_SERVICE_URL || 'http://car-service:3002',
  booking: process.env.BOOKING_SERVICE_URL || 'http://booking-service:3003',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3004',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3005',
  review: process.env.REVIEW_SERVICE_URL || 'http://review-service:3006'
};

// Proxy routes
app.use('/api/users', createProxyMiddleware({
  target: services.user,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/'
  }
}));

app.use('/api/cars', createProxyMiddleware({
  target: services.car,
  changeOrigin: true,
  pathRewrite: {
    '^/api/cars': '/'
  }
}));

app.use('/api/bookings', createProxyMiddleware({
  target: services.booking,
  changeOrigin: true,
  pathRewrite: {
    '^/api/bookings': '/'
  }
}));

app.use('/api/payments', createProxyMiddleware({
  target: services.payment,
  changeOrigin: true,
  pathRewrite: {
    '^/api/payments': '/'
  }
}));

app.use('/api/notifications', createProxyMiddleware({
  target: services.notification,
  changeOrigin: true,
  pathRewrite: {
    '^/api/notifications': '/'
  }
}));

app.use('/api/reviews', createProxyMiddleware({
  target: services.review,
  changeOrigin: true,
  pathRewrite: {
    '^/api/reviews': '/'
  }
}));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'api-gateway' });
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`API Gateway is running on port ${PORT}`);
});
