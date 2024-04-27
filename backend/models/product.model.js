const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  _productCategoryId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    data: Buffer,
    type: String,
  },
  rating: {
    type: mongoose.Types.Decimal128,
    required: true,
    default: 0,
  },
  desc: {
    type: String,
    required: true,
  },
  price: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
