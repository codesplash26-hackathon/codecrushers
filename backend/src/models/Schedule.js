const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  tripId: { type: String, required: true },
  departureTime: { type: String, required: true }, // HH:mm format
  arrivalTime: { type: String, required: true },
  stopTimes: [{
    stopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop' },
    arrivalTime: String,
    departureTime: String
  }],
  operatingDays: [{ type: String }] // e.g. ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
});

module.exports = mongoose.model('Schedule', scheduleSchema);
