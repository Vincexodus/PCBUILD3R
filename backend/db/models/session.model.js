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
      required: true,
      default: Date.now
  },
  modifiedAt: {
      type: Date,
  },
})

const Session = mongoose.model('Session', SessionSchema);

module.exports = { Session }