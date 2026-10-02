const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  activeSemester: { type: String, default: 'Harmattan 2026' },
  tutors: [{
    department: String,
    name: String
  }],
  isPaymentPortalOpen: { type: Boolean, default: false }
});

module.exports = mongoose.model('Settings', settingsSchema);