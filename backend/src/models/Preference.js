const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  weights: {
    travelTime: { type: Number, default: 0.3 },
    cost: { type: Number, default: 0.2 },
    waitingTime: { type: Number, default: 0.15 },
    transfers: { type: Number, default: 0.15 },
    walkingDistance: { type: Number, default: 0.1 },
    connectionRisk: { type: Number, default: 0.1 }
  },
  maxWalkingDistanceMeters: { type: Number, default: 1000 },
  allowedModes: [{ type: String, enum: ['BUS', 'TRAIN', 'TAXI', 'THREE_WHEELER', 'WALK'] }]
});

module.exports = mongoose.model('Preference', preferenceSchema);
