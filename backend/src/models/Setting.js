const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    // General & Platform
    systemName: {
      type: String,
      default: "BestRoute Multimodal Transit Platform",
    },
    operationalRegion: {
      type: String,
      default: "Western & Central Province (Kandy - Colombo Corridor)",
    },
    timezone: {
      type: String,
      default: "Asia/Colombo (UTC+05:30)",
    },
    currency: {
      type: String,
      default: "LKR (Rs.)",
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    allowUserRegistration: {
      type: Boolean,
      default: true,
    },
    gpsRefreshIntervalSeconds: {
      type: Number,
      default: 5,
    },

    // Journey Optimization Algorithm Weights
    algorithmWeights: {
      timeWeight: { type: Number, default: 40 }, // 40%
      costWeight: { type: Number, default: 30 }, // 30%
      reliabilityWeight: { type: Number, default: 20 }, // 20%
      walkingWeight: { type: Number, default: 10 }, // 10%
      transferBufferMinutes: { type: Number, default: 5 },
      maxWalkingDistanceKm: { type: Number, default: 1.5 },
      connectionRiskThresholdMinutes: { type: Number, default: 4 },
    },

    // Disruption & Alerts Policy
    disruptionSettings: {
      autoBroadcastAlerts: { type: Boolean, default: true },
      minSeverityForPush: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        default: "MEDIUM",
      },
      autoReoptimizeRoutes: { type: Boolean, default: true },
      monsoonDelayMultiplier: { type: Number, default: 1.25 },
      autoResolveGraceHours: { type: Number, default: 24 },
    },

    // Fare & Transit Rates
    fareSettings: {
      busBaseFare: { type: Number, default: 30 },
      busPerKmRate: { type: Number, default: 8 },
      trainBaseFare: { type: Number, default: 50 },
      trainPerKmRate: { type: Number, default: 3 },
      tukBaseFare: { type: Number, default: 100 },
      tukPerKmRate: { type: Number, default: 80 },
      taxiBaseFare: { type: Number, default: 250 },
      taxiPerKmRate: { type: Number, default: 120 },
      driverCommissionPercentage: { type: Number, default: 10 },
    },

    // Infrastructure & System
    systemSettings: {
      apiBaseUrl: { type: String, default: "http://localhost:5000/api" },
      databaseHost: { type: String, default: "mongodb://mongodb:27017/bestroute" },
      cacheTtlSeconds: { type: Number, default: 300 },
      logLevel: { type: String, default: "info" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);
