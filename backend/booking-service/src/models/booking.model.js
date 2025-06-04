const mongoose = require('mongoose');
const { BOOKING_TYPES, HOURLY_BOOKING_OPTIONS } = require('../constants/booking.types');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Vehicle'
  },
  car_providerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  bookingType: {
    type: String,
    enum: Object.values(BOOKING_TYPES),
    required: true
  },
  hourlyDuration: {
    type: Number,
    enum: Object.values(HOURLY_BOOKING_OPTIONS).map(option => option.duration),
    required: function() {
      return this.bookingType === BOOKING_TYPES.HOURLY;
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'cancelled', 'rejected', 'approved', 'started', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'cancelled', 'rejected', 'approved', 'started', 'completed']
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  }],
  paymentHistory: [{
    status: {
      type: String,
      enum: ['unpaid', 'paid']
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { 
  timestamps: {
    currentTime: () => new Date(new Date().getTime() + (7 * 60 * 60 * 1000))
  }
});

// Pre-save middleware to track status changes
bookingSchema.pre('save', function(next) {
  // If this is a new document, add initial status to histories
  if (this.isNew) {
    this.statusHistory = [{
      status: this.status,
      changedAt: new Date()
    }];
    this.paymentHistory = [{
      status: this.paymentStatus,
      changedAt: new Date()
    }];
  } else {
    // If status has changed, add to history
    if (this.isModified('status')) {
      this.statusHistory.push({
        status: this.status,
        changedAt: new Date()
      });
    }
    // If payment status has changed, add to history
    if (this.isModified('paymentStatus')) {
      this.paymentHistory.push({
        status: this.paymentStatus,
        changedAt: new Date()
      });
    }
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema); 