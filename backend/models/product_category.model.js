const mongoose = require('mongoose');

const ProductCategorySchema = new mongoose.Schema({
  productCategoryName: {
      type: String,
      required: true
  },
  productCategoryNameShort: {
      type: String,
      required: true
  },
  productCategoryImage: {
      data: Buffer,
      type: String,
  },
  createdAt: {
      type: Date,
      required: false,
      default: Date.now
  },
})

module.exports = mongoose.model('ProductCategory', ProductCategorySchema);