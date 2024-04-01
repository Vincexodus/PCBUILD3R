const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
  key: {
      type: String,
      required: true
  },
  percent: {
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

module.exports = mongoose.model('Voucher', VoucherSchema);