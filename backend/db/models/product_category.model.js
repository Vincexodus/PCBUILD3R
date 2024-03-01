const mongoose = require('mongoose');

const ProductCategorySchema = new mongoose.Schema({
  _productCategoryId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  name: {
      type: String,
      required: true
  },
  desc: {
      type: String,
      required: true,
  },
  createdAt: {
      type: Date,
      required: true,
      default: Date.now
  },
  modifiedAt: {
      type: Date,
  },
  deletedAt: {
      type: Date,
  },
})

const ProductCategory = mongoose.model('ProductCategory', ProductCategorySchema);

module.exports = { ProductCategory }