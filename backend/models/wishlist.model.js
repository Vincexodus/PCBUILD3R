const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  _userId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  _productId: {
      type: mongoose.Types.ObjectId,
      required: true
  }
})

module.exports = mongoose.model('Wishlist', WishlistSchema);