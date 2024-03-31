const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  _feedbackId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  _productId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  completion: {
      type: mongoose.Types.Decimal128,
      required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  }
})

module.exports = mongoose.model('Session', SessionSchema);