const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Role-based authorization middleware
exports.authorizeRoles = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user.role;

  // Admin has all permissions
  if (userRole === 'admin') {
    return next();
  }

  // Check if user's role is in allowed roles
  if (allowedRoles.includes(userRole)) {
    return next();
  }

  // Special case: car_provider has customer permissions
  if (userRole === 'car_provider' && allowedRoles.includes('customer')) {
    return next();
  }

  return res.status(403).json({ 
    error: 'Forbidden: insufficient permissions',
    message: 'You do not have permission to perform this action'
  });
};

// Specific role check middleware
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Forbidden: admin access required',
      message: 'Only administrators can perform this action'
    });
  }
  next();
};

exports.isCarProvider = (req, res, next) => {
  if (req.user.role !== 'car_provider' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Forbidden: car provider access required',
      message: 'Only car providers can perform this action'
    });
  }
  next();
};

exports.isCustomer = (req, res, next) => {
  if (!['customer', 'car_provider', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ 
      error: 'Forbidden: customer access required',
      message: 'Only customers can perform this action'
    });
  }
  next();
}; 