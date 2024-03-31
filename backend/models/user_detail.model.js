const mongoose = require('mongoose');

const UserDetailSchema = new mongoose.Schema({
  _userId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  address: {
      type: String,
      required: true
  },
  city: {
      type: String,
      required: true,
  },
  postalCode: {
      type: String,
      required: true,
  },
  country: {
      type: String,
      required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  CVC: {
    type: String,
    required: true,
  },
  expireMonth: {
    type: String,
    required: true,
  },
  expireYear: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  }
})

module.exports = mongoose.model('UserDetail', UserDetailSchema);