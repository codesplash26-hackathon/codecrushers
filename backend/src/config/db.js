const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bestroute";
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.warn("MongoDB connection warning:", error.message);
    console.warn(
      "Backend running in resilient mode without active MongoDB instance."
    );
  }
};

module.exports = connectDB;