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
})

module.exports = mongoose.model('Session', SessionSchema);