const mongoose = require('mongoose');

const GameStatsSchema = new mongoose.Schema({
  _userId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  _sessionId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  level: {
      type: Number,
      required: true,
      default: 1
  },
  experience: {
      type: Number,
      required: true,
      default: 0
  },
})

module.exports = mongoose.model('GameStats', GameStatsSchema);