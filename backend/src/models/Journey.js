const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  origin: {
    name: String,
    coordinates: [Number]
  },
  destination: {
    name: String,
    coordinates: [Number]
  },
  segments: [{
    mode: { type: String, enum: ['BUS', 'TRAIN', 'TAXI', 'THREE_WHEELER', 'WALK'] },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
    fromStop: String,
    toStop: String,
    departureTime: String,
    arrivalTime: String,
    durationMinutes: Number,
    cost: Number,
    walkingDistanceMeters: Number,
    connectionRisk: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' }
  }],
  totalDurationMinutes: Number,
  totalCost: Number,
  totalWalkingDistanceMeters: Number,
  transfersCount: Number,
  score: Number,
  status: { type: String, enum: ['PLANNED', 'IN_PROGRESS', 'RE_ROUTED', 'COMPLETED'], default: 'PLANNED' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Journey', journeySchema);
