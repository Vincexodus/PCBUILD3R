const mongoose = require('mongoose');

const UserPaymentSchema = new mongoose.Schema({
  _userId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  paymentType: {
      type: String,
      required: true
  },
  provider: {
      type: String,
      required: true
  },
  accountNo: {
      type: Number,
      required: true
  },
  expiry: {
      type: Date,
  },
})

module.exports = mongoose.model('UserPayment', UserPaymentSchema);