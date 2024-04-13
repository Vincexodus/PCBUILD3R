const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  voucherKey: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    default: 1
  },
  rating: {
    type: Number,
    required: true,
    default: 1
  },
  desc: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  }
})

module.exports = mongoose.model('Session', SessionSchema);