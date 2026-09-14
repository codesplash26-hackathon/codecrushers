const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['PASSENGER', 'ADMIN'], default: 'PASSENGER' },
  preferredPreference: { 
    type: String, 
    enum: ['FASTEST', 'CHEAPEST', 'MIN_WALKING', 'MIN_TRANSFERS', 'MOST_RELIABLE'],
    default: 'FASTEST' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
