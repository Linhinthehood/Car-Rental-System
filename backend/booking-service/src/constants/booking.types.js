const BOOKING_TYPES = {
  HOURLY: 'hourly',
  DAILY: 'daily'
};

const HOURLY_BOOKING_OPTIONS = {
  SIX_HOURS: {
    duration: 6,
    priceMultiplier: 0.5 // 50% of daily rate
  },
  EIGHT_HOURS: {
    duration: 8,
    priceMultiplier: 0.65 // 65% of daily rate
  },
  TWELVE_HOURS: {
    duration: 12,
    priceMultiplier: 0.75 // 75% of daily rate
  }
};

module.exports = {
  BOOKING_TYPES,
  HOURLY_BOOKING_OPTIONS
}; 