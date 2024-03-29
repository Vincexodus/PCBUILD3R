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
})

module.exports = mongoose.model('CartItem', CartItemSchema);