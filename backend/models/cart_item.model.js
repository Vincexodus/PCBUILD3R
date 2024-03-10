const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  _productId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  quantity: {
      type: Number,
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

module.exports = mongoose.model('CartItem', CartItemSchema);