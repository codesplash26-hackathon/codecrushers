const mongoose = require("mongoose");
const {
  DISRUPTION_TYPES,
  DISRUPTION_SEVERITY,
  DISRUPTION_STATUS,
} = require("../config/constants");

const disruptionSchema = new mongoose.Schema(
  {
    affectedService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportService",
    },

    affectedRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },

    affectedTrip: {
      type: String,
      trim: true,
    },

    disruptionType: {
      type: String,
      enum: Object.values(DISRUPTION_TYPES),
      required: true,
      default: DISRUPTION_TYPES.DELAY,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    delayMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },

    startTime: {
      type: Date,
      default: Date.now,
    },

    expectedEndTime: {
      type: Date,
    },

    status: {
      type: String,
      enum: Object.values(DISRUPTION_STATUS),
      default: DISRUPTION_STATUS.ACTIVE,
    },

    severity: {
      type: String,
      enum: Object.values(DISRUPTION_SEVERITY),
      default: DISRUPTION_SEVERITY.MEDIUM,
    },

    affectedStops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stop",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Disruption", disruptionSchema);
