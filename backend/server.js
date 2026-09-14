const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/journey', require('./src/routes/journeyRoutes'));
app.use('/api/routes', require('./src/routes/routeRoutes'));
app.use('/api/disruptions', require('./src/routes/disruptionRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/notifications', require('./src/routes/notificationRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

// Error Handler Middleware
app.use(require('./src/middlewares/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BestRoute Backend Server running on port ${PORT}`);
});
