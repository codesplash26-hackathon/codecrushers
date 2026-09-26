const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["passenger", "driver", "admin", "super_admin", "operator", "read_only"],
      default: "passenger",
    },

    driverStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },

    driverDetails: {
      vehicleType: String,
      vehicleNo: String,
      vehicleModel: String,
      phone: String,
      isOnline: { type: Boolean, default: false },
    },

    preferences: {
      type: String,
      enum: [
        "fastest",
        "cheapest",
        "minimum_walking",
        "minimum_transfers",
        "most_reliable",
      ],
      default: "fastest",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);