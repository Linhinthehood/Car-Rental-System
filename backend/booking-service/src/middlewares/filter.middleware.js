const { query } = require('express-validator');

const filterMiddleware = [
  query('status')
    .optional()
    .isIn(['pending', 'cancelled', 'rejected', 'approved', 'started', 'completed'])
    .withMessage('Invalid booking status'),
  
  query('paymentStatus')
    .optional()
    .isIn(['unpaid', 'paid'])
    .withMessage('Invalid payment status'),

  (req, res, next) => {
    const { status, paymentStatus } = req.query;
    const filter = {};

    // Add status filter if provided
    if (status) {
      filter.status = status;
    }

    // Add payment status filter if provided
    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    // Add filter to request
    req.filter = filter;
    next();
  }
];

module.exports = filterMiddleware; 