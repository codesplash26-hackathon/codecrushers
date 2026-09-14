const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  eventType: { type: String, required: true }, // SEARCH, ROUTE_SELECTED, RE_ROUTED, DISRUPTION_NOTIFIED
  metadata: { type: Object },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
