const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  _userId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  _productId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  quantity: {
      type: Number,
      required: true
  },
  isPaid: {
      type: Boolean,
      required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  }
})

module.exports = mongoose.model('CartItem', CartItemSchema);