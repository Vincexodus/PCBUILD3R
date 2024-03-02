const mongoose = require('mongoose');

const PaymentDetailsSchema = new mongoose.Schema({
  _orderId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  amount: {
      type: mongoose.Types.Decimal128,
      required: true,
  },
  status: {
      type: String,
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

const PaymentDetails = mongoose.model('PaymentDetails', PaymentDetailsSchema);

module.exports = { PaymentDetails }