const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['customer', 'worker'], default: 'customer' },
  password: { type: String, required: true },

  // ===== Worker-only fields =====
  skill: {
    type: String,
    enum: ['electrician', 'plumber', 'carpenter', 'cleaner', 'painter', 'gardener'],
    required: function () { return this.role === 'worker'; }
  },
  experience: {
    type: Number,
    required: function () { return this.role === 'worker'; }
  },
  photo: {
  type: String,
  default: null
},
  location: {
    type: String,
    required: function () { return this.role === 'worker'; }
  },
  hourlyRate: {
    type: Number,
    required: function () { return this.role === 'worker'; }
  },
  bio: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);