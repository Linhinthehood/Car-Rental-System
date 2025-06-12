require('dotenv').config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT ,
  services: {
    user: {
      url: process.env.USER_SERVICE_URL 
    },
    vehicle: {
      url: process.env.VEHICLE_SERVICE_URL 
    },
    booking: {
      url: process.env.BOOKING_SERVICE_URL 
    }
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

// Validate required configurations
const requiredEnvVars = [
  'USER_SERVICE_URL',
  'VEHICLE_SERVICE_URL',
  'BOOKING_SERVICE_URL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

module.exports = config; 