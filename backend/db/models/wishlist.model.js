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

const WishList = mongoose.model('Wishlist', WishlistSchema);

module.exports = { WishList }