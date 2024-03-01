const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
  _discountId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
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
      required: true,
      default: Date.now
  },
  modifiedAt: {
      type: Date,
  },
  deletedAt: {
      type: Date,
  },
})

const Discount = mongoose.model('Discount', DiscountSchema);

module.exports = { Discount }