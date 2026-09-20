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
      enum: ["bus", "train", "taxi", "three_wheeler", "walking"],
      required: true,
    },

    operator: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "delayed", "cancelled"],
      default: "active",
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