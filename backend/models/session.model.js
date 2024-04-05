const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  _reviewId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  level: {
      type: Number,
      required: true,
      default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  }
})

module.exports = mongoose.model('Session', SessionSchema);