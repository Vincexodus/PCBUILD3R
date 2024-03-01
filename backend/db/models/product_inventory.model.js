const mongoose = require('mongoose');

const ProductInventorySchema = new mongoose.Schema({
  _productCategoryId: {
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
  deletedAt: {
      type: Date,
  },
})

const ProductInventory = mongoose.model('ProductInventory', ProductInventorySchema);

module.exports = { ProductInventory }