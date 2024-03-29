const mongoose = require('mongoose');

const OrderItemsSchema = new mongoose.Schema({
  _orderId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  _productId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  quantity: {
      type: Number,
      required: true,
      default: 1
  },
})

module.exports = mongoose.model('OrderItems', OrderItemsSchema);