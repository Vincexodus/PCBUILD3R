const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  _cartItemId: {
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
  createdAt: {
      type: Date,
      required: true,
      default: Date.now
  },
  modifiedAt: {
      type: Date,
  },
})

const CartItem = mongoose.model('CartItem', CartItemSchema);

module.exports = { CartItem }