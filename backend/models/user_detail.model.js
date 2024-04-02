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
    required: false,
  },
  CVC: {
    type: String,
    required: false,
  },
  expireMonth: {
    type: String,
    required: false,
  },
  expireYear: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  }
})

module.exports = mongoose.model('UserDetail', UserDetailSchema);