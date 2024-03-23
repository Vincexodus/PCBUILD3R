const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  _productCategoryId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  _inventoryId: {
      type: mongoose.Types.ObjectId,
      required: false
  },
  _discountId: {
      type: mongoose.Types.ObjectId,
      required: false
  },
  productName: {
      type: String,
      required: true
  },
  productImage: {
    data: Buffer,
    type: String,
},
  desc: {
      type: String,
      required: true,
  },
  price: {
      type: mongoose.Types.Decimal128,
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

module.exports = mongoose.model('Product', ProductSchema);