const { body } = require('express-validator');
const { BOOKING_TYPES } = require('../constants/booking.types');
const Booking = require('../models/booking.model');

// Validation middleware for creating booking
const validateBooking = [
  body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('bookingType')
    .isIn(Object.values(BOOKING_TYPES))
    .withMessage('Invalid booking type'),
  body('hourlyDuration')
    .if(body('bookingType').equals(BOOKING_TYPES.HOURLY))
    .isInt({ min: 6, max: 12 })
    .withMessage('Hourly duration must be 6, 8, or 12 hours')
];

// Middleware to check if user can update booking status
const canUpdateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isCarProvider = booking.car_providerId.toString() === req.user.id;
    const isCustomer = booking.userId.toString() === req.user.id;
    const { status } = req.body;

    // Validate user role and status transition
    if (isCarProvider) {
      // Car provider can only update status in this order: pending -> approved/rejected -> started -> completed
      const validTransitions = {
        pending: ['approved', 'rejected'],
        approved: ['started'],
        started: ['completed'],
        rejected: [],
        cancelled: [],
        completed: []
      };

      if (!validTransitions[booking.status].includes(status)) {
        return res.status(400).json({ 
          message: `Invalid status transition. Current status: ${booking.status}, Can only transition to: ${validTransitions[booking.status].join(', ')}` 
        });
      }
    } else if (isCustomer) {
      // Customer can only cancel when status is pending
      if (status !== 'cancelled' || booking.status !== 'pending') {
        return res.status(400).json({ 
          message: 'Customers can only cancel bookings that are in pending status' 
        });
      }
    } else {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Attach booking to request for later use
    req.booking = booking;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error validating booking status update' });
  }
};

// Middleware to check if user can view booking
const canViewBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (booking.userId.toString() !== req.user.id && 
        booking.car_providerId.toString() !== req.user.id &&
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    // Attach booking to request for later use
    req.booking = booking;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error validating booking access' });
  }
};

module.exports = {
  validateBooking,
  canUpdateBookingStatus,
  canViewBooking
}; 