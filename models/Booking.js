const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: { type: String, required: true },
  address: { type: String, required: true },
  notes: { type: String },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'paid'],
    default: 'pending'
  },
  amount: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);