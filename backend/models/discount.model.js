const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  desc: {
      type: String,
      required: true
  },
  discount_percent: {
      type: mongoose.Types.Decimal128,
      required: true
  },
  active: {
      type: Boolean,
      required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  }
})

module.exports = mongoose.model('Discount', DiscountSchema);