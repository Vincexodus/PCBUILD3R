const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  _productId: {
    type: mongoose.Types.ObjectId,
      required: true
  },
  rating: {
      type: Number,
      required: true,
      default: 1
  },
  desc: {
      type: String,
      required: true,
  },
})

module.exports = mongoose.model('Review', ReviewSchema);