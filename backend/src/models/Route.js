const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeCode: { type: String, required: true, unique: true },
  routeName: { type: String, required: true },
  mode: { type: String, enum: ['BUS', 'TRAIN', 'TAXI', 'THREE_WHEELER', 'WALK'], required: true },
  provider: { type: String, required: true },
  stops: [{
    stopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop' },
    sequenceOrder: Number,
    travelTimeFromPrev: Number // in minutes
  }],
  fareMatrix: [{
    fromStopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop' },
    toStopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop' },
    cost: Number
  }],
  reliabilityScore: { type: Number, default: 0.95 },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Route', routeSchema);
