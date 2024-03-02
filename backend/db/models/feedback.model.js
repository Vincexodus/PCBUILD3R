const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  subject: {
      type: String,
      required: true
  },
  rating: {
      type: Number,
      required: true,
      default: 1
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
})

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = { Feedback }