const connectDB = require('../config/db');
const Stop = require('../models/Stop');
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Seeding initial transit data for Sri Lanka (Kandy, Colombo, Galle)...');
    // Seed bus/train stops, schedules, fares
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
