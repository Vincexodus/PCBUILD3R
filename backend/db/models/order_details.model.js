const mongoose = require('mongoose');

const OrderDetailsSchema = new mongoose.Schema({
  _orderDetailsId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  _userId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  _paymentId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  total: {
      type: mongoose.Types.Decimal128,
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
})

const OrderDetails = mongoose.model('OrderDetails', OrderDetailsSchema);

module.exports = { OrderDetails }