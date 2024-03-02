const mongoose = require('mongoose');

const ProductCategorySchema = new mongoose.Schema({
  productCategoryName: {
      type: String,
      required: true
  },
  desc: {
      type: String,
      required: true,
  },
  createdAt: {
      type: Date,
      required: false,
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