const mongoose = require('mongoose');

const disruptionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  disruptionType: { 
    type: String, 
    enum: ['DELAY', 'CANCELLATION', 'ROAD_CLOSURE', 'TRAFFIC', 'ROUTE_INTERRUPTION'],
    required: true 
  },
  affectedRouteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  affectedStopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop' },
  delayMinutes: { type: Number, default: 0 },
  description: { type: String },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  status: { type: String, enum: ['ACTIVE', 'RESOLVED'], default: 'ACTIVE' }
});

module.exports = mongoose.model('Disruption', disruptionSchema);
