const mongoose = require("mongoose");

const legSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TransportService",
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
  },
  departureStop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stop",
  },
  arrivalStop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stop",
  },
  departureTime: {
    type: String,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  travelTime: Number,
  fare: Number,
});

const journeySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    origin: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    destination: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    departureTime: String,
    arrivalTime: String,
    totalTravelTime: Number,
    totalFare: Number,
    transfers: {
      type: Number,
      default: 0,
    },
    legs: [legSchema],
    status: {
      type: String,
      enum: ["active", "rerouted", "completed", "cancelled"],
      default: "active",
    },
    isAffectedByDisruption: {
      type: Boolean,
      default: false,
    },
    connectionRiskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "MISSED"],
      default: "LOW",
    },
    connectionRiskScore: {
      type: Number,
      default: 10,
    },
    selectedAlternativeJourneyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Journey",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Journey", journeySchema);
