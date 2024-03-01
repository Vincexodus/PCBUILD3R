const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _userId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  username: {
      type: String,
      required: true
  },
  password: {
      type: String,
      required: true,
  },
  firstName: {
      type: String,
      required: true,
  },
  lastName: {
      type: String,
      required: true,
  },
  telephone: {
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
})

const User = mongoose.model('User', UserSchema);

module.exports = { User }