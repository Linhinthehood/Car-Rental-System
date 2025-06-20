// Role-based authorization middleware
const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user.role;

  // Admin có mọi quyền
  if (userRole === 'admin') {
    return next();
  }

  // Kiểm tra role có trong allowedRoles không
  if (allowedRoles.includes(userRole)) {
    return next();
  }

  // Trường hợp đặc biệt: car_provider có quyền customer
  if (userRole === 'car_provider' && allowedRoles.includes('customer')) {
    return next();
  }

  return res.status(403).json({ 
    error: 'Forbidden: insufficient permissions',
    message: 'You do not have permission to perform this action'
  });
};

// Specific role check middleware
const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Forbidden',
        message: 'Only administrators can perform this action',
        requiredRole: 'admin',
        currentRole: req.user.role
      });
    }
    next();
  } catch (err) {
    console.error('Error in isAdmin middleware:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to verify admin role',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const isCarProvider = (req, res, next) => {
  if (req.user.role !== 'car_provider' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Forbidden: car provider access required',
      message: 'Only car providers can perform this action'
    });
  }
  next();
};

const isCustomer = (req, res, next) => {
  if (!['customer', 'car_provider', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ 
      error: 'Forbidden: customer access required',
      message: 'Only customers can perform this action'
    });
  }
  next();
};

module.exports = { authorizeRoles, isAdmin, isCarProvider, isCustomer }; 