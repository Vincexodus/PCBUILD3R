const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  _cartItemIds: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  ],
  _voucherId: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  total: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
