const mongoose = require('mongoose');

const UserAddressSchema = new mongoose.Schema({
  _userId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  addressLine1: {
      type: String,
      required: true
  },
  addressLine2: {
      type: String,
      required: true,
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
})

const UserAddress = mongoose.model('UserAddress', UserAddressSchema);

module.exports = { UserAddress }