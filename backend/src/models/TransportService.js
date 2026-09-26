const mongoose = require("mongoose");

const transportServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["bus", "train", "taxi", "three_wheeler", "tuk-tuk", "tuk", "three-wheeler", "walking"],
      required: true,
      lowercase: true,
    },

    operator: {
      type: String,
      trim: true,
    },

    routes: {
      type: Number,
      default: 0,
    },

    vehicles: {
      type: Number,
      default: 0,
    },

    icon: {
      type: String,
    },

    modeColor: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "delayed", "cancelled"],
      default: "active",
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TransportService",
  transportServiceSchema
);